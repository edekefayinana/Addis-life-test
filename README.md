This project is built with Next.js 16 (app router) and follows a server-component-first approach with a small, shared UI kit.

## Prerequisites

- Node.js 20.x and npm 10+ (required to install dependencies; not run in this environment)
- For installs later: `npm install` then `npm run prepare` (Husky hooks)

## Project guardrails

- Server Components by default. Never add `'use client'` to root pages; isolate interactivity into small client components and import them into server components.
- Conditional rendering: favor early returns and descriptive helpers over nested ternaries.
- Design tokens only: use Tailwind theme colors and spacing (e.g., `bg-primary`, `py-4`); avoid hardcoded hex values or arbitrary pixel utilities.
- Dependencies: prefer existing utilities or native APIs; get approval before adding new libraries and document the rationale in PRs. Lucide icons are the default choice when an icon is needed.
- Naming: root page components use the `Page` suffix (e.g., `HomePage`), components are PascalCase, variables/functions camelCase, true constants UPPER_SNAKE_CASE.
- Props: define component props interfaces in the same file as the component (TypeScript `interface`, named `ComponentNameProps`).

## Folder structure

- `app/` — root app router (server-first). Page-specific components live in `app/<page>/_components/`.
- `components/ui/` — shared primitives (button, card, input, label, textarea).
- `lib/utils.ts` — `cn` helper for class merging.
- `public/` — static assets (icons/images). Prefer Lucide React over custom SVGs; if a custom icon is required, optimize it and place it under `public/assets/icons`.
- `src/` — kept for legacy paths; new work should use the root `app/` and `components/` folders.

## UI kit usage

- Shared primitives: import from `@/components/ui/*`. Example:
  - `import { Button } from '@/components/ui/button';`
  - `import { Card } from '@/components/ui/card';`
  - `import { Input } from '@/components/ui/input';`
  - `import { Label } from '@/components/ui/label';`
  - `import { Textarea } from '@/components/ui/textarea';`
- Class merging: always use `cn` from `@/lib/utils` for conditional classes.
- Keep page sections server-rendered; drop in client components only where interactivity is required.
- The primitives are self-contained here; if you prefer the full shadcn generator, add its dependencies once npm is available and regenerate as needed.

## Icons

- Default to Lucide React icons. When npm is available, install with `npm install lucide-react` (not run here because npm is unavailable).
- If you must add a custom SVG, optimize it and place it under `public/assets/icons`, but prefer a close Lucide match instead.

## Setup & scripts (run once Node/npm are available)

- `npm install` — install dependencies (not executed here because npm is unavailable).
- `npm run dev` — start the dev server
- `npm run lint` — lint with ESLint
- `npm run lint-staged` — lint/format staged files (pre-commit)
- `npm run format` / `npm run format:check` — format or check with Prettier
- `npm run type-check` — TypeScript type checking
- `npm run build` — production build

## Git hooks

- `pre-commit`: runs `lint-staged` (ESLint + Prettier on staged files)
- `pre-push`: runs `npm run type-check` and `npm run build`

## CI

GitHub Actions workflow (`.github/workflows/ci.yml`) runs install, lint, type-check, and build on pushes/PRs to `main`.

## Environment variables

Create a `.env.local` file as needed (example keys: `NEXT_PUBLIC_API_URL`). A committed sample is intentionally omitted; copy from teammates or set your own values.
