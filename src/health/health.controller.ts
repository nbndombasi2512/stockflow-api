import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
import { HealthStatusDto } from "./dto/health-status.dto";
import { HealthService, type HealthStatus } from "./health.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Health check" })
  @ApiOkResponse({ type: HealthStatusDto })
  check(): HealthStatus {
    return this.healthService.check();
  }
}
