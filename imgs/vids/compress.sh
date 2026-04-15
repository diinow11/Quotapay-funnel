#!/bin/bash
# Video compression script for web playback
# All videos → 720p, H.264 CRF 23, optimized for small screens
# Requires: ffmpeg

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v ffmpeg &>/dev/null; then
    echo "Error: ffmpeg is not installed. Install with: brew install ffmpeg"
    exit 1
fi

echo "=== Video Compression (all → 720p) ==="
echo ""

total_before=0
total_after=0

for file in *.MP4 *.mp4 *.mov *.MOV; do
    [ -f "$file" ] || continue
    [[ "$file" == tmp_compressed_* ]] && continue

    before_size=$(stat -f%z "$file")
    before_mb=$(echo "scale=1; $before_size / 1048576" | bc)
    total_before=$((total_before + before_size))

    # Get video height (the longer dimension for portrait videos)
    height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$file" 2>/dev/null)

    tmp_out="tmp_compressed_${file%.*}.mp4"

    if [ "$height" -gt 720 ] 2>/dev/null; then
        echo "[$file] ${before_mb}MB — downscale to 720p"
        ffmpeg -y -i "$file" \
            -vf "scale=-2:720" \
            -c:v libx264 -crf 23 -preset slow \
            -c:a aac -b:a 96k \
            -pix_fmt yuv420p \
            -movflags +faststart \
            "$tmp_out" 2>/dev/null
    else
        echo "[$file] ${before_mb}MB — re-encode at 720p"
        ffmpeg -y -i "$file" \
            -c:v libx264 -crf 23 -preset slow \
            -c:a aac -b:a 96k \
            -pix_fmt yuv420p \
            -movflags +faststart \
            "$tmp_out" 2>/dev/null
    fi

    after_size=$(stat -f%z "$tmp_out")
    after_mb=$(echo "scale=1; $after_size / 1048576" | bc)
    total_after=$((total_after + after_size))
    pct=$(echo "scale=1; 100 - $after_size * 100 / $before_size" | bc)

    rm "$file"
    out_name="${file%.*}.mp4"
    mv "$tmp_out" "$out_name"

    echo "  → ${after_mb}MB (${pct}% smaller)"
    echo ""
done

total_before_mb=$(echo "scale=1; $total_before / 1048576" | bc)
total_after_mb=$(echo "scale=1; $total_after / 1048576" | bc)
total_pct=$(echo "scale=1; 100 - $total_after * 100 / $total_before" | bc)

echo "=== Done ==="
echo "Total: ${total_before_mb}MB → ${total_after_mb}MB (${total_pct}% smaller)"
