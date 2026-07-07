# stockflow-api

Standalone NestJS REST backend for StockFlow. This is an independent project (its
own `node_modules` and lockfile); it is **not** part of the root pnpm/Turbo
workspace. Run all commands from inside this folder.

## Requirements

- Node >= 22.13
- pnpm 11.6.0

## Setup

```bash
cd stockflow-api
pnpm install
cp .env.example .env   # adjust values as needed
```

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start in watch mode                  |
| `pnpm build`      | Compile to `dist/`                   |
| `pnpm start`      | Run the compiled server              |
| `pnpm type-check` | Type-check without emitting          |
| `pnpm lint`       | Lint `src`                           |
| `pnpm test`       | Run unit tests                       |

## Environment variables

Loaded via `@nestjs/config`. See [.env.example](.env.example).

- `PORT` — port the API listens on (default `3001`)
- `FRONTEND_ORIGIN` — allowed CORS origin (default `http://localhost:3000`)
- `DATABASE_URL` — reserved for future database work

## Endpoints

- `GET /health` — returns `200` with `{ status, uptime, timestamp }`

## Structure

```
src/
  main.ts              # bootstrap: CORS + PORT
  app.module.ts        # root module (global ConfigModule)
  config/
    configuration.ts   # typed env config
  health/
    health.module.ts
    health.controller.ts
    health.service.ts
    __tests__/
      index.spec.ts
```
