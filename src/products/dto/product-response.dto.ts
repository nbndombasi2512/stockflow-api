import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProductResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id!: string;

  @ApiProperty({ example: "Widget" })
  name!: string;

  @ApiProperty({ example: "WDG-001" })
  sku!: string;

  @ApiProperty({ example: "Standard widget for warehouse stock" })
  description!: string;

  @ApiProperty({ example: "Hardware" })
  category!: string;

  @ApiProperty({ example: "each" })
  unit!: string;

  @ApiPropertyOptional({ example: 10, nullable: true })
  reorderThreshold!: number | null;

  @ApiPropertyOptional({
    example: "https://cdn.example.com/widget.jpg",
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiProperty({ example: false })
  archived!: boolean;

  @ApiProperty({ example: "2026-08-27T12:00:00.000Z" })
  createdAt!: Date;
}
