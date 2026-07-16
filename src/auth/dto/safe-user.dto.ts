import { ApiProperty } from "@nestjs/swagger";

export class SafeUserDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id!: string;

  @ApiProperty({ example: "alice@example.com" })
  email!: string;

  @ApiProperty({ example: "2026-07-16T12:00:00.000Z" })
  createdAt!: Date;
}
