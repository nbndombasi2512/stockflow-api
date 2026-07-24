import { ApiProperty } from "@nestjs/swagger";
import { SafeUserDto } from "./safe-user.dto";

export class LoginResponseDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken!: string;

  @ApiProperty({ type: SafeUserDto })
  user!: SafeUserDto;
}
