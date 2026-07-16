import { ApiProperty } from "@nestjs/swagger";

export class HealthStatusDto {
  @ApiProperty({ example: "ok", enum: ["ok"] })
  status!: "ok";

  @ApiProperty({ example: 12.34 })
  uptime!: number;

  @ApiProperty({ example: "2026-07-16T12:00:00.000Z" })
  timestamp!: string;
}
