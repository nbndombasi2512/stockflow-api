import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class ListLocationsQueryDto {
  @ApiPropertyOptional({
    example: false,
    description: "When true, include archived locations in the list",
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  includeArchived?: boolean;
}
