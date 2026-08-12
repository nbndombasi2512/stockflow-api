import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LocationResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id!: string;

  @ApiProperty({ example: "Main Warehouse" })
  name!: string;

  @ApiPropertyOptional({
    example: "Primary storage for finished goods",
    nullable: true,
  })
  notes!: string | null;

  @ApiProperty({ example: false })
  archived!: boolean;

  @ApiProperty({ example: "2026-08-12T12:00:00.000Z" })
  createdAt!: Date;
}
