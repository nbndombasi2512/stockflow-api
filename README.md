# stockflow-api

Standalone NestJS REST backend for StockFlow. This is an independent project (its
own `node_modules` and lockfile); it is **not** part of the root pnpm/Turbo
workspace. Run all commands from inside this folder.

## Requirements

- Node >= 22.13
- pnpm 11.6.0
- Docker (for local PostgreSQL)

## Setup

```bash
cd stockflow-api
pnpm install
cp .env.example .env   # adjust values as needed
```

### Local database

PostgreSQL runs via Docker Compose. Credentials match the default `DATABASE_URL` in `.env.example`.

```bash
pnpm db:up                 # start Postgres (postgres:16-alpine on port 5432)
pnpm prisma:migrate:dev    # apply migrations locally (creates new ones during development)
pnpm prisma:migrate:deploy # apply existing migrations (CI / production)
```

Stop the database with `pnpm db:down`.

Schema models are added in later tickets (M1+). The initial migration is intentionally empty and only establishes Prisma Migrate tracking.

Prisma Client is generated on `pnpm install` (`postinstall`) and via `pnpm prisma:generate`.

## Scripts

| Command                      | Description                                   |
| ---------------------------- | --------------------------------------------- |
| `pnpm dev`                   | Start in watch mode                           |
| `pnpm build`                 | Compile to `dist/`                            |
| `pnpm start`                 | Run the compiled server                       |
| `pnpm type-check`            | Type-check without emitting                   |
| `pnpm lint`                  | Lint `src`                                    |
| `pnpm test`                  | Run unit tests                                |
| `pnpm db:up`                 | Start local Postgres (`docker compose up -d`) |
| `pnpm db:down`               | Stop local Postgres (`docker compose down`)   |
| `pnpm prisma:generate`       | Generate Prisma Client                        |
| `pnpm prisma:migrate:dev`    | Create/apply migrations in development        |
| `pnpm prisma:migrate:deploy` | Apply migrations (CI / production)            |

## Environment variables

Loaded via `@nestjs/config`. See [.env.example](.env.example).

- `PORT` — port the API listens on (default `3001`)
- `FRONTEND_ORIGIN` — allowed CORS origin (default `http://localhost:3000`)
- `DATABASE_URL` — PostgreSQL connection string (default points at Docker Compose)

## Endpoints

- `GET /health` — returns `200` with `{ status, uptime, timestamp }`

## Structure

```
prisma/
  schema.prisma        # Prisma schema (PostgreSQL via DATABASE_URL)
  migrations/          # Prisma Migrate history
src/
  main.ts              # bootstrap: CORS + PORT
  app.module.ts        # root module (ConfigModule + PrismaModule)
  config/
    configuration.ts   # typed env config
  prisma/
    prisma.module.ts   # global PrismaModule
    prisma.service.ts  # injectable PrismaClient wrapper
    __tests__/
      index.spec.ts
  health/
    health.module.ts
    health.controller.ts
    health.service.ts
    __tests__/
      index.spec.ts
```
