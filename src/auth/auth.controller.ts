import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService, type SafeUser } from "./auth.service";
import { SafeUserDto } from "./dto/safe-user.dto";
import { SignupDto } from "./dto/signup.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new user" })
  @ApiCreatedResponse({
    description: "User created successfully",
    type: SafeUserDto,
  })
  @ApiBadRequestResponse({ description: "Validation failed" })
  @ApiConflictResponse({ description: "Email already registered" })
  signup(@Body() dto: SignupDto): Promise<SafeUser> {
    return this.authService.signup(dto);
  }
}
