# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies (use pnpm, not npm/yarn)
pnpm install

# Development - start Astro dev server
pnpm --filter web dev

# Build for production
pnpm --filter web build

# Preview production build
pnpm --filter web preview

# Lint
pnpm --filter web lint
pnpm --filter web lint:fix

# Type checking
pnpm --filter web typecheck

# Format code
pnpm format
```

The dev server runs at `http://localhost:4321`.

## Architecture Overview

**QuotaPay** — a hire purchase electronics company selling Hisense products in Kenya.
0% interest, 40% deposit, 3–6 month payment plans. Contact: 0724 200 456 | info@myquotapay.com

This is a **Turborepo monorepo** using pnpm workspaces with an Astro + React frontend.

### Workspace Structure

- **apps/web** - Astro 5 application with React integration (main website)
- **packages/ui** - Shared React UI components library (`@workspace/ui`)
- **packages/eslint-config** - Shared ESLint configurations (`@workspace/eslint-config`)
- **packages/typescript-config** - Shared TypeScript configurations (`@workspace/typescript-config`)

### Key Data Files

- `apps/web/src/data/products.ts` - All ~170 products across 13 categories with pricing/payment plans
- `apps/web/src/data/site-config.ts` - Company info, WhatsApp number, qualification requirements

### Pages

- `/` - Homepage with hero, value props, categories, how it works, qualification requirements
- `/products` - Product catalog with category filtering and expandable payment breakdowns
- `/404` - Branded not-found page

### Key Patterns

**Importing UI Components:**
```tsx
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
```

**Path Aliases:**
- `@/*` → `apps/web/src/*` (in web app)
- `@workspace/ui/*` → `packages/ui/src/*`

**Styling:**
- Tailwind CSS v4 configured in `packages/ui`
- Global styles in `packages/ui/src/styles/globals.css`
- Uses CSS custom properties with oklch colors for theming (green primary, blue accent)
- Light theme (forced)
- Component styling uses `class-variance-authority` (cva) for variants

**Component Pattern (shadcn/ui style):**
- Components use `cn()` utility for class merging (clsx + tailwind-merge)
- Radix UI primitives for accessible components
- Variant-based styling with cva

### File Conventions

- Astro pages: `apps/web/src/pages/*.astro`
- Astro components: `apps/web/src/components/*.astro`
- React components: `*.tsx` files
- Layouts: `apps/web/src/layouts/*.astro`

### TypeScript

- Strict mode enabled
- Base config in `packages/typescript-config/base.json`
- ESNext modules with bundler resolution for the web app
