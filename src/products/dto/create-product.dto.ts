import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: "Widget" })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ example: "WDG-001" })
  @IsString()
  @MinLength(1)
  sku!: string;

  @ApiProperty({ example: "Standard widget for warehouse stock" })
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiProperty({ example: "Hardware" })
  @IsString()
  @MinLength(1)
  category!: string;

  @ApiProperty({ example: "each" })
  @IsString()
  @MinLength(1)
  unit!: string;

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
}
