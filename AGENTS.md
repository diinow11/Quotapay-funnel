# PROJECT KNOWLEDGE BASE

**Generated:** 2025-12-29
**Type:** Turborepo monorepo - Perfume Quiz Application

## OVERVIEW

Perfume recommendation quiz for InspiredHero. Astro 5 SSG + React 19 interactive components. Monorepo with shared UI package.

## TECH STACK

- **Framework:** Astro 5.1.6 + React 19.1.1
- **Build:** Turborepo 2.5.5, pnpm 10.4.1
- **Styling:** Tailwind CSS 4.1.11 (v4 beta), oklch colors
- **UI Pattern:** shadcn/ui style (cva + cn + Radix primitives)
- **Effects:** OGL library for WebGL (LiquidChrome)
- **Analytics:** TikTok Pixel, Umami

## STRUCTURE

```
inspiredhero-master-opt/
├── apps/web/                  # Astro application
│   ├── src/pages/             # File-based routing (.astro)
│   ├── src/components/        # Quiz components (React + Astro)
│   ├── src/data/perfumes.ts   # Static perfume catalog
│   └── public/                # Static assets (quiz/, perfumes/)
├── packages/ui/               # @workspace/ui - shared components
│   ├── src/components/        # button.tsx (shadcn pattern)
│   ├── src/lib/utils.ts       # cn() utility
│   └── src/styles/globals.css # Tailwind + CSS vars
├── packages/eslint-config/    # @workspace/eslint-config
├── packages/typescript-config/# @workspace/typescript-config
└── perfume images/            # Source images (NOT in public/)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add quiz question | `apps/web/src/components/Quiz.tsx` | QUIZ_STEPS array |
| Add perfume | `apps/web/src/data/perfumes.ts` | PERFUMES array |
| Modify recommendation | `apps/web/src/components/Quiz.tsx` | finishQuiz() scoring |
| Add page | `apps/web/src/pages/*.astro` | File = route |
| Shared component | `packages/ui/src/components/` | Export in package.json |
| Global styles | `packages/ui/src/styles/globals.css` | CSS vars + Tailwind |
| Icons | `apps/web/src/components/icons/` | Custom .astro icons |

## CODE MAP

| Component | Role | Key Logic |
|-----------|------|-----------|
| `Quiz.tsx` | Main quiz orchestrator | Step management, scoring algorithm, TikTok events |
| `QuizCard.tsx` | Option card UI | Image + label + selection state |
| `QuizResult.tsx` | Result display | Perfume recommendation + CTA |
| `LiquidChrome.tsx` | WebGL effect | OGL-based visual (link-tree page) |
| `perfumes.ts` | Data source | Static catalog with scoring attributes |

### Quiz Scoring Algorithm

```
score = gender_match(5) + vibe_match(3) + scent_match(15) + custom_weights
```
Custom weights: sweet→Baccarat, feminine→Chanel, masculine+woody→One Million, etc.

## CONVENTIONS

**Imports:**
```tsx
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Component } from "@/components/Component";  // in web app
```

**Component Pattern:** shadcn/ui style
- Use `cn()` for class merging (clsx + tailwind-merge)
- Use `cva()` for variants
- Forward refs, spread props

**Styling:**
- CSS custom properties with oklch colors
- Dark mode via `.dark` class
- Tailwind v4 syntax (`@theme`, `@custom-variant`)

**TypeScript:**
- Strict mode ON
- No `any` without justification
- Prefer interfaces over types for objects

## ANTI-PATTERNS (THIS PROJECT)

| Pattern | Why Bad | Do Instead |
|---------|---------|------------|
| `getEntryBySlug()` | Deprecated Astro API | Use `getEntry()` |
| `getDataEntryById()` | Deprecated Astro API | Use `getEntry()` |
| Import from node_modules directly | Breaks workspace protocol | Use `@workspace/ui/*` |
| CSS in component files | Breaks Tailwind purge | Use globals.css or inline Tailwind |
| New icon libraries | Inconsistent with existing | Add to `icons/` as .astro |

## COMMANDS

```bash
# Development
pnpm --filter web dev          # Start dev server (localhost:4321)

# Build & Preview
pnpm --filter web build        # Production build
pnpm --filter web preview      # Preview build

# Quality
pnpm --filter web lint         # Run ESLint
pnpm --filter web lint:fix     # Auto-fix lint issues
pnpm --filter web check-types  # TypeScript check
pnpm format                    # Prettier (ts,tsx,md)

# Monorepo
pnpm build                     # Build all via Turbo
pnpm install                   # Install all workspaces
```

## GAPS (Known)

- **No tests** - No Jest/Vitest configured
- **No CI/CD** - No GitHub Actions
- **No E2E** - No Playwright/Cypress

## NOTES

- Quiz images in `public/quiz/` and `public/perfumes/`
- Source images in root `perfume images/` folder (not deployed)
- TikTok Pixel fires: ViewContent (first click), ClickButton (subsequent), CompleteRegistration (result)
- Umami pixels fire per quiz step for funnel tracking
- `sharp` required for Astro image optimization
