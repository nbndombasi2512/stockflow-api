# AGENTS.md

Instructions for AI coding agents working in **stockflow-api**, a standalone NestJS REST API for StockFlow.

Always create a new branch for a new ticket, do not make changes directly on main.

## Project overview

| Area            | Choice                                        |
| --------------- | --------------------------------------------- |
| Runtime         | Node >= 22.13                                 |
| Package manager | pnpm 11.6.0 (run all commands from repo root) |
| Framework       | NestJS 11                                     |
| Database        | PostgreSQL 16 via Docker Compose              |
| ORM             | Prisma 6                                      |
| Testing         | Jest 30 + `@nestjs/testing`                   |
| Linting         | ESLint 10 flat config (`eslint.config.mjs`)   |
| Language        | TypeScript 6, strict mode, `module: nodenext` |

This repo is **not** part of a parent pnpm/Turbo workspace. It has its own `node_modules` and lockfile.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm prisma:migrate:dev
```

## Commands

| Task                        | Command                      |
| --------------------------- | ---------------------------- |
| Dev server (watch)          | `pnpm dev`                   |
| Build                       | `pnpm build`                 |
| Production start            | `pnpm start`                 |
| Type-check                  | `pnpm type-check`            |
| Lint                        | `pnpm lint`                  |
| Test                        | `pnpm test`                  |
| Start Postgres              | `pnpm db:up`                 |
| Stop Postgres               | `pnpm db:down`               |
| Generate Prisma client      | `pnpm prisma:generate`       |
| Dev migrations              | `pnpm prisma:migrate:dev`    |
| Deploy migrations (CI/prod) | `pnpm prisma:migrate:deploy` |

Run `pnpm lint`, `pnpm type-check`, and `pnpm test` before finishing a change.

## Architecture

```
src/
  main.ts              # bootstrap: CORS + listen on PORT
  app.module.ts        # root module
  config/
    configuration.ts   # typed AppConfig from env vars
  prisma/              # global PrismaModule + PrismaService
  <feature>/           # one folder per feature module
```

**Module wiring:** `AppModule` imports `ConfigModule` (global), `PrismaModule` (global), and feature modules. Register new feature modules in `app.module.ts`.

**Config:** Add env vars to `src/config/configuration.ts` and `.env.example`. Access via `ConfigService<AppConfig, true>` with `{ infer: true }`.

**Database:** Inject `PrismaService` in services. Do not instantiate `PrismaClient` directly. Schema lives in `prisma/schema.prisma`; migrations in `prisma/migrations/`.

## Code style

- Double-quoted strings and imports (match existing files).
- Feature folders use `kebab-case`; files use Nest dot notation (`health.controller.ts`).
- Classes: PascalCase. Route prefixes: kebab-case or single words (`@Controller("health")`).
- Export response types from services (e.g. `HealthStatus`), not inline in controllers.
- Keep controllers thin — delegate logic to services.
- Minimize scope: no unrelated refactors, no premature abstractions.
- No path aliases — use relative imports.
- Comments only for non-obvious business logic.

## Adding a feature module

1. Create `src/<feature>/` with `<feature>.module.ts`, `<feature>.service.ts`, and optionally `<feature>.controller.ts`.
2. Add `__tests__/index.spec.ts` beside the feature.
3. Import the module in `app.module.ts`.
4. Run lint, type-check, and tests.

See `.cursor/skills/nestjs-feature-module/SKILL.md` for templates.

## Prisma workflow

1. Edit `prisma/schema.prisma`.
2. Run `pnpm prisma:migrate:dev --name <descriptive_name>`.
3. Commit both `schema.prisma` and the new migration folder.
4. Use `pnpm prisma:migrate:deploy` in CI/production — never `migrate dev` there.

See `.cursor/skills/nestjs-prisma/SKILL.md` for details.

## Testing

- Unit tests live in `src/<feature>/__tests__/index.spec.ts`.
- Simple units: manual `setup()` helper (see `health/__tests__`).
- Nest DI / lifecycle: `Test.createTestingModule` (see `prisma/__tests__`).
- Mock external I/O (DB, network); do not hit a real database in unit tests.
- Add tests only when they cover meaningful behavior — avoid trivial assertions.

See `.cursor/skills/nestjs-testing/SKILL.md` for patterns.

## Environment variables

| Variable          | Default                 | Purpose                      |
| ----------------- | ----------------------- | ---------------------------- |
| `PORT`            | `3001`                  | API listen port              |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | CORS allowed origin          |
| `DATABASE_URL`    | see `.env.example`      | PostgreSQL connection string |

Never commit `.env` or secrets.

## Security

- Do not commit `.env`, credentials, or connection strings with real passwords.
- Do not log secrets or full `DATABASE_URL`.
- Validate and sanitize user input at API boundaries (use `class-validator` / `class-transformer` when DTOs are introduced).
- Prefer parameterized queries via Prisma — never concatenate SQL strings.

## Do not

- Run `prisma migrate dev` in CI or production.
- Add models to migrations without updating `schema.prisma`.
- Skip registering new modules in `AppModule`.
- Add e2e tests under `test/` unless explicitly requested (project uses unit tests in `__tests__/`).
- Use `any` without strong justification.
- Commit generated `node_modules/` or Prisma client output.

## Project skills

Cursor skills in `.cursor/skills/` provide step-by-step workflows:

| Skill                   | Use when                                        |
| ----------------------- | ----------------------------------------------- |
| `nestjs-feature-module` | Adding or scaffolding a new NestJS module       |
| `nestjs-prisma`         | Schema changes, migrations, PrismaService usage |
| `nestjs-testing`        | Writing or updating unit tests                  |
