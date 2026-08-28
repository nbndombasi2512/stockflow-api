import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class UpdateProductDto {
  @ApiPropertyOptional({ example: "Widget" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ example: "WDG-001" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  sku?: string;

  @ApiPropertyOptional({ example: "Standard widget for warehouse stock" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @ApiPropertyOptional({ example: "Hardware" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  category?: string;

  @ApiPropertyOptional({ example: "each" })
  @IsOptional()
  @IsString()
  @MinLength(1)
  unit?: string;

  @ApiPropertyOptional({ example: 10, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reorderThreshold?: number;

  @ApiPropertyOptional({
    example: "https://cdn.example.com/widget.jpg",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}
