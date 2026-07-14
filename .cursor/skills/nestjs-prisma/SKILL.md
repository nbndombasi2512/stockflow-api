---
name: nestjs-prisma
description: >-
  Manages Prisma schema, migrations, and database access in stockflow-api.
  Use when adding models, changing schema, running migrations, querying with
  PrismaService, or working with prisma/schema.prisma.
---

# NestJS Prisma Workflow

## When to use

- Adding or modifying database models
- Creating or reviewing migrations
- Writing queries in services via `PrismaService`
- Debugging Prisma client or connection issues

## PrismaService usage

`PrismaService` extends `PrismaClient` and is provided globally by `PrismaModule`.

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.item.findUnique({ where: { id } });
  }
}
```

**Rules:**
- Inject `PrismaService` — never `new PrismaClient()`
- Do not import `PrismaModule` in feature modules (it is `@Global()`)
- Use Prisma's typed query API; avoid `$queryRaw` unless necessary
- Wrap multi-step writes in `prisma.$transaction()`

## Schema changes

```
Task Progress:
- [ ] Step 1: Ensure Postgres is running (pnpm db:up)
- [ ] Step 2: Edit prisma/schema.prisma
- [ ] Step 3: Run pnpm prisma:migrate:dev --name <descriptive_name>
- [ ] Step 4: Verify generated SQL in prisma/migrations/
- [ ] Step 5: Commit schema.prisma + migration folder together
- [ ] Step 6: Update services and tests
```

### Model conventions

```prisma
model Product {
  id        String   @id @default(cuid())
  name      String
  sku       String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- Table names: PascalCase models map to snake_case tables by default; use `@@map("table_name")` if needed.
- IDs: prefer `cuid()` or `uuid()` — match existing models when present.
- Always add `createdAt` / `updatedAt` on domain entities unless there is a reason not to.
- Use `@relation` fields explicitly; add indexes for foreign keys and frequent query columns.

## Migration commands

| Environment | Command |
|-------------|---------|
| Local dev | `pnpm prisma:migrate:dev --name add_products` |
| CI / production | `pnpm prisma:migrate:deploy` |
| Regenerate client | `pnpm prisma:generate` |

**Never** run `migrate dev` in CI or production — it can prompt interactively and may reset data.

## Local database

```bash
pnpm db:up      # start postgres:16-alpine on :5432
pnpm db:down    # stop and remove container
```

Default `DATABASE_URL` is in `.env.example` (user/password/stockflow).

## Testing with Prisma

Unit tests must **not** connect to a real database. Options:

1. **Mock `PrismaService`** — provide a mock in `Test.createTestingModule`
2. **Spy on prototype methods** — for lifecycle tests (see `prisma/__tests__`)

```typescript
const mockPrisma = {
  product: {
    findMany: jest.fn().mockResolvedValue([]),
  },
};

const moduleRef = await Test.createTestingModule({
  providers: [
    ItemsService,
    { provide: PrismaService, useValue: mockPrisma },
  ],
}).compile();
```

## Common pitfalls

- Forgetting `pnpm prisma:generate` after schema changes (runs on `postinstall`, but needed immediately in dev)
- Committing only `schema.prisma` without the migration folder
- Using `migrate dev` in deployment pipelines
- Adding `@default(autoincrement())` on String id fields
- Missing `@updatedAt` when adding `updatedAt DateTime`

## Checklist before done

- [ ] Migration SQL reviewed for destructive changes
- [ ] `schema.prisma` and migration folder committed together
- [ ] Services use injected `PrismaService`
- [ ] Tests mock DB access
- [ ] `pnpm test` passes
