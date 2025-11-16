# Repository Guidelines

## Project Structure & Module Organization
This Vite + React workspace centers on `src/`, where `main.tsx` wires `App.tsx`, React Router, and the shared React Query client. Feature-ready UI lives in `src/components` (shadcn/ui wrappers), `src/pages` (route-level views), `src/hooks`, and `src/lib` for data helpers. Styles originate in `src/index.css` and Tailwind tokens inside `tailwind.config.ts`, while static assets stay in `public/` and marketing shots in `screenshots/`. Use the `@/` alias (see `tsconfig.json`) for concise imports.

## Build, Test, and Development Commands
- `npm run dev` – Hot-reload dev server on port 5173.
- `npm run build` – Production bundle written to `dist/`.
- `npm run build:dev` – Debug-friendly development build artifacts.
- `npm run preview` – Serves the built `dist/` output for smoke checks.
- `npm run lint` – ESLint across the repo with React Hooks + Refresh plugins.

## Coding Style & Naming Conventions
Write TypeScript-first, prefer `const` arrow components, and keep modules focused on a single concern. Indent with 2 spaces, favor early returns, and mirror the existing `PascalCase` for components, `camelCase` for hooks/utilities, and `kebab-case` for folders. Compose styles through Tailwind utilities, `clsx`, and `class-variance-authority`; avoid ad-hoc CSS except in `index.css`. Run `npm run lint` before pushing—this config is the canonical formatting rule set.

## Testing Guidelines
Automated tests are not established yet, so document manual coverage in each PR (feature exercised, browsers checked, responsive breakpoints). When adding tests, colocate specs next to the component (`ImageCard.test.tsx`) and lean on Vitest + Testing Library, which integrate cleanly with Vite. Always verify error toasts, download flows, and multi-upload edge cases manually before review.

## Commit & Pull Request Guidelines
History favors short, imperative messages with optional Conventional prefixes (e.g., `feat: add palette picker`, `Fix: Process and Download All`). Follow that format so changelog tooling stays viable. Every PR should link the related issue/task, summarize the problem + solution, list local test steps, and attach screenshots or screen recordings when UI shifts. Keep PRs scoped, ensure `npm run build` and `npm run lint` pass, and request review only after resolving warnings.

## Configuration & Security Tips
Client-exposed secrets must start with `VITE_` and live in `.env.local` (git-ignored). Tailwind purges based on the `content` globs in `tailwind.config.ts`, so update the list if you add directories or file types. React Query caches live for the session; remember to invalidate keys inside `src/lib` helpers when data changes to avoid stale UI.
