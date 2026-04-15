/**
 * Generate responsive image variants for quiz result page optimization
 * 
 * Usage: npx tsx scripts/generate-responsive-images.ts
 * 
 * Generates 320w, 640w, 960w WebP variants for:
 * - Slider images (slide-2 through slide-5)
 * - Testimonial images (review-1 through review-3)
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const WIDTHS = [320, 640, 960];
const QUALITY = 85;

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const IMAGES_TO_PROCESS = [
  // Slider images
  { src: 'slider/slide-2.webp', outDir: 'slider/responsive' },
  { src: 'slider/slide-3.webp', outDir: 'slider/responsive' },
  { src: 'slider/slide-4.webp', outDir: 'slider/responsive' },
  { src: 'slider/slide-5.webp', outDir: 'slider/responsive' },
  // Testimonial images (first 3 for preloading)
  { src: 'testimonials/review-1.webp', outDir: 'testimonials/responsive' },
  { src: 'testimonials/review-2.webp', outDir: 'testimonials/responsive' },
  { src: 'testimonials/review-3.webp', outDir: 'testimonials/responsive' },
];

async function generateVariants(imagePath: string, outDir: string) {
  const fullSrcPath = path.join(PUBLIC_DIR, imagePath);
  const fullOutDir = path.join(PUBLIC_DIR, outDir);
  
  // Ensure output directory exists
  if (!fs.existsSync(fullOutDir)) {
    fs.mkdirSync(fullOutDir, { recursive: true });
  }
  
  const baseName = path.basename(imagePath, '.webp');
  
  // Get original image metadata
  const metadata = await sharp(fullSrcPath).metadata();
  const originalWidth = metadata.width || 1200;
  
  console.log(`Processing: ${imagePath} (${originalWidth}px wide)`);
  
  for (const width of WIDTHS) {
    // Skip if target width is larger than original
    if (width > originalWidth) {
      console.log(`  Skipping ${width}w (larger than original)`);
      continue;
    }
    
    const outFileName = `${baseName}-${width}w.webp`;
    const outPath = path.join(fullOutDir, outFileName);
    
    await sharp(fullSrcPath)
      .resize(width, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: QUALITY })
      .toFile(outPath);
    
    const stats = fs.statSync(outPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`  Created: ${outFileName} (${sizeKB}KB)`);
  }
}

async function main() {
  console.log('Generating responsive image variants...\n');
  
  for (const { src, outDir } of IMAGES_TO_PROCESS) {
    try {
      await generateVariants(src, outDir);
    } catch (error) {
      console.error(`Error processing ${src}:`, error);
    }
  }
  
  console.log('\nDone! Responsive images generated.');
}

main();
