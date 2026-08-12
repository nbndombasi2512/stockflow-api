import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateLocationDto {
  @ApiProperty({ example: "Main Warehouse" })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: "Primary storage for finished goods" })
  @IsOptional()
  @IsString()
  notes?: string;
}
