---
name: nestjs-feature-module
description: >-
  Scaffolds NestJS feature modules following stockflow-api conventions.
  Use when adding a new module, controller, service, endpoint, or feature
  area to this NestJS project.
---

# NestJS Feature Module

## When to use

- User asks to add a feature, module, endpoint, or API area
- Creating new `src/<feature>/` directories
- Wiring a module into `AppModule`

## Workflow

```
Task Progress:
- [ ] Step 1: Create feature folder and files
- [ ] Step 2: Implement service (business logic)
- [ ] Step 3: Implement controller (HTTP layer, if needed)
- [ ] Step 4: Create module and register in AppModule
- [ ] Step 5: Add tests in __tests__/index.spec.ts
- [ ] Step 6: Run pnpm lint && pnpm type-check && pnpm test
```

## File layout

```
src/<feature>/
  <feature>.module.ts
  <feature>.service.ts
  <feature>.controller.ts   # omit if no HTTP surface
  __tests__/
    index.spec.ts
```

## Templates

### Module

```typescript
import { Module } from "@nestjs/common";
import { FeatureController } from "./feature.controller";
import { FeatureService } from "./feature.service";

@Module({
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService], // only if other modules need it
})
export class FeatureModule {}
```

### Service

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface FeatureResult {
  // typed response shape
}

@Injectable()
export class FeatureService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FeatureResult[]> {
    // business logic here
    return [];
  }
}
```

### Controller

```typescript
import { Controller, Get } from "@nestjs/common";
import { FeatureService, type FeatureResult } from "./feature.service";

@Controller("feature")
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get()
  findAll(): Promise<FeatureResult[]> {
    return this.featureService.findAll();
  }
}
```

### Register in AppModule

```typescript
import { FeatureModule } from "./feature/feature.module";

@Module({
  imports: [
    // ...existing imports
    FeatureModule,
  ],
})
export class AppModule {}
```

## Conventions

- `PrismaService` is globally available — inject it, do not import `PrismaModule` in feature modules.
- `ConfigService<AppConfig, true>` is globally available for env access.
- Export response types from the service file; import with `type` in controllers.
- Route prefix: kebab-case, plural for collections (`products`, `stock-items`).
- Keep controllers to routing and delegation — no business logic in controllers.
- Use `async`/`await` for Prisma calls; return typed promises from controller methods.

## Config changes

If the feature needs new env vars:

1. Add to `AppConfig` interface in `src/config/configuration.ts`
2. Map from `process.env` in `configuration()`
3. Document in `.env.example`

## Checklist before done

- [ ] Module registered in `app.module.ts`
- [ ] Tests cover main service/controller behavior
- [ ] No `any` types on public interfaces
- [ ] `pnpm lint`, `pnpm type-check`, `pnpm test` pass
