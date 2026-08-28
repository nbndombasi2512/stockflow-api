import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class ListProductsQueryDto {
  @ApiPropertyOptional({
    example: false,
    description: "When true, include archived products in the list",
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  includeArchived?: boolean;
}
