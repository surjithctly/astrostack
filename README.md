# AstroStack Starter

AstroStack is a starter template built with Astro, Payload CMS, and Tailwind CSS.

## Structure

- `apps/web/` - Astro app
- `apps/admin/` - Payload CMS app
- `packages/` - shared libraries (optional)

## Setup

1. Install dependencies:
   `pnpm install`
2. Run apps:
   `pnpm dev`

## Scripts

- `pnpm dev` - run all app dev servers
- `pnpm dev:web` - run Astro only
- `pnpm dev:admin` - run Payload only
- `pnpm build` - build all apps
- `pnpm lint` / `pnpm typecheck` / `pnpm format` - if present

## Environment

Copy env vars from `env.example` and rename to `.env` as needed.

## Tooling

- Shared configs: `tsconfig.base.json`, `.eslintrc.cjs`, `.prettierrc`
- CI workflow: `.github/workflows/ci.yml`
- Docker is intended for deployment (Coolify). Local dev uses `pnpm dev`.

## Coolify (Docker Compose)

Use the included `docker-compose.yml` as a custom service in Coolify.

1. Create a **Docker Compose** (custom service) app in Coolify.
2. Point it to the repo root and select `docker-compose.yml`.
3. Set the required environment variables:
   - `DATABASE_URL`
   - `PAYLOAD_SECRET`
   - `PAYLOAD_PUBLIC_SERVER_URL`
4. The compose file includes a Postgres service. If you prefer a managed DB,
   remove the `postgres` service and set `DATABASE_URL` to your managed
   connection string.
