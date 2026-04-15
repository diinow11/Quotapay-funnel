# inspiredhero monorepo

This repository hosts a small multi-package workspace. The `apps/web` project is now powered by [Astro](https://astro.build) and consumes shared UI primitives from the `packages/ui` workspace package.

## Developing locally

```bash
# Install dependencies once
pnpm install

# Start the Astro app (apps/web)
pnpm --filter web dev
```

## Building

```bash
pnpm --filter web build
```

The generated site is emitted to `apps/web/dist`.

## UI package

Shared components live in `packages/ui`. Import them via the workspace package name:

```tsx
import { Button } from "@workspace/ui/components/button"
```

Tailwind CSS is configured once inside `packages/ui/src/styles/globals.css` and is consumed by the Astro app via a workspace import.

## Link tree page

- Route: `/link-tree`
- File: `apps/web/src/pages/link-tree.astro`
- Edit the `LINKS` array at the top of the file to point to your real Website, Instagram, and TikTok URLs.

Run locally and open the page at `http://localhost:4321/link-tree` after starting the dev server:

```bash
pnpm --filter web dev
```
