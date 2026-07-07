import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import type { AppConfig } from "./config/configuration";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppConfig, true>);

  const frontendOrigin = configService.get("frontendOrigin", { infer: true });
  const port = configService.get("port", { infer: true });

  app.enableCors({ origin: frontendOrigin });

  await app.listen(port);
}

void bootstrap();
