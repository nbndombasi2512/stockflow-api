import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class SignupDto {
  @ApiProperty({ example: "alice@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: "secret123",
    minLength: 8,
    description: "At least 8 characters, including one letter and one number",
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: "password must contain at least one letter and one number",
  })
  password!: string;
}
