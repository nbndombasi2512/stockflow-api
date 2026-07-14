---
name: nestjs-testing
description: >-
  Writes unit tests for stockflow-api following project Jest conventions.
  Use when adding, updating, or fixing tests in __tests__/index.spec.ts,
  mocking NestJS providers, or testing controllers and services.
---

# NestJS Testing

## When to use

- Adding tests for a new feature module
- Fixing failing Jest tests
- Choosing between manual setup vs `Test.createTestingModule`

## Test location

All unit tests live in `src/<feature>/__tests__/index.spec.ts` — not co-located `*.spec.ts` next to each file.

Jest config (`jest.config.js`):
- `rootDir: "src"`
- `testRegex: ".*\\.spec\\.ts$"`
- `testEnvironment: "node"`

## Pattern 1: Manual setup (simple units)

Use when testing pure logic with no Nest DI or lifecycle hooks.

```typescript
import { HealthController } from "../health.controller";
import { HealthService } from "../health.service";

describe("HealthController", () => {
  const setup = () => {
    const service = new HealthService();
    const controller = new HealthController(service);
    return { controller, service };
  };

  it("returns ok status", () => {
    const { controller } = setup();
    expect(controller.check().status).toBe("ok");
  });
});
```

**Prefer this when:** the class has a simple constructor with no injected dependencies, or dependencies are easy to instantiate manually.

## Pattern 2: Testing module (DI and lifecycle)

Use when testing module wiring, `OnModuleInit`/`OnModuleDestroy`, or services with injected providers.

```typescript
import { Test } from "@nestjs/testing";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";

describe("PrismaModule", () => {
  it("connects on init and disconnects on destroy", async () => {
    const connect = jest
      .spyOn(PrismaService.prototype, "$connect")
      .mockResolvedValue(undefined);
    const disconnect = jest
      .spyOn(PrismaService.prototype, "$disconnect")
      .mockResolvedValue(undefined);

    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    await moduleRef.init();
    expect(connect).toHaveBeenCalled();

    await moduleRef.close();
    expect(disconnect).toHaveBeenCalled();

    connect.mockRestore();
    disconnect.mockRestore();
  });
});
```

**Prefer this when:** testing Nest modules, global providers, or lifecycle hooks.

## Pattern 3: Mocked dependencies

Use when a service depends on `PrismaService` or other injectables.

```typescript
import { Test } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { ItemsService } from "../items.service";

describe("ItemsService", () => {
  const mockPrisma = {
    item: {
      findMany: jest.fn(),
    },
  };

  const setup = async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    return moduleRef.get(ItemsService);
  };

  beforeEach(() => jest.clearAllMocks());

  it("returns items from prisma", async () => {
    mockPrisma.item.findMany.mockResolvedValue([{ id: "1", name: "Widget" }]);
    const service = await setup();

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(mockPrisma.item.findMany).toHaveBeenCalled();
  });
});
```

## Guidelines

- Test behavior, not implementation details.
- One logical assertion focus per test (multiple `expect` calls for one outcome is fine).
- Use `beforeEach(() => jest.clearAllMocks())` when reusing mock objects.
- Always `mockRestore()` spies on prototypes to avoid leaking between tests.
- Do not connect to real Postgres in unit tests.
- Do not add tests that only assert a function exists or a mock was defined.

## Running tests

```bash
pnpm test                              # all tests
pnpm test -- --testPathPattern=health  # single feature
pnpm test -- --watch                   # watch mode
```

## Checklist before done

- [ ] Tests in `__tests__/index.spec.ts`
- [ ] External I/O mocked (DB, HTTP, filesystem)
- [ ] Spies restored after use
- [ ] `pnpm test` passes
- [ ] `pnpm type-check` passes (tests are excluded from build but type-checked separately)
