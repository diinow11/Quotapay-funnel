# InspiredHero Project Context

## Project Overview

This project is a **Turborepo monorepo** containing a modern web application powered by **Astro 5** and **React 19**. It utilizes a shared UI package for consistent styling and component usage across the workspace.

### Key Technologies
- **Monorepo Management:** Turborepo (`turbo`)
- **Package Manager:** pnpm
- **Frontend Framework:** Astro 5 (Static Site Generation / Server Side Rendering)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4, `class-variance-authority` (cva), `clsx`, `tailwind-merge`, `lucide-react` (icons)
- **Languages:** TypeScript

## Architecture & Directory Structure

The project follows a standard Turborepo structure:

- **`apps/web/`**: The main consumer application built with Astro.
  - `src/pages/`: Astro pages (file-based routing).
  - `src/components/`: Astro and React components specific to the web app.
  - `src/layouts/`: Astro layout components.
- **`packages/ui/`**: A shared internal UI library (`@workspace/ui`).
  - `src/components/`: Reusable React components (e.g., `button.tsx`).
  - `src/lib/`: Utility functions (e.g., `utils.ts` containing `cn`).
  - `src/styles/`: Global styles (`globals.css`).
- **`packages/eslint-config/`**: Shared ESLint configuration.
- **`packages/typescript-config/`**: Shared TypeScript configuration.

## Development Workflow

### Prerequisites
- Node.js >= 20
- pnpm (Package Manager)

### Common Commands

| Command | Description |
| :--- | :--- |
| `pnpm install` | Install dependencies for the entire workspace. |
| `pnpm --filter web dev` | Start the Astro development server for `apps/web`. |
| `pnpm --filter web build` | Build the Astro app for production. |
| `pnpm --filter web preview` | Preview the production build locally. |
| `pnpm build` | Build all packages and apps using Turbo. |
| `pnpm format` | Format code using Prettier. |

### Key Conventions

1.  **Importing Shared UI:**
    Components from the UI package should be imported using the `@workspace/ui` alias:
    ```tsx
    import { Button } from "@workspace/ui/components/button";
    import { cn } from "@workspace/ui/lib/utils";
    ```

2.  **Styling:**
    -   Tailwind CSS v4 is configured in `packages/ui`.
    -   Global styles are located in `packages/ui/src/styles/globals.css`.
    -   Components use `cva` for variant management and `cn` for class merging.

3.  **Path Aliases:**
    -   `@/*` resolves to `apps/web/src/*` within the web app.
    -   `@workspace/ui/*` resolves to `packages/ui/src/*`.

## Important Files

- **`apps/web/src/pages/link-tree.astro`**: A specific "Link Tree" page where users can update social media links (Website, Instagram, TikTok).
- **`packages/ui/src/lib/utils.ts`**: Contains the `cn` utility helper for Tailwind class merging.
- **`turbo.json`**: Configuration for the Turbo build system.

## Additional Context

- **Perfume Images:** There is a folder `perfume images` in the parent directory containing assets likely intended for use within the web application.
- **Astro Config:** Located at `apps/web/astro.config.mjs`.
