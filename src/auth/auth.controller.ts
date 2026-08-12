import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthService, type LoginResult, type SafeUser } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { SafeUserDto } from "./dto/safe-user.dto";
import { SignupDto } from "./dto/signup.dto";

interface AuthenticatedRequest {
  user: SafeUser;
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("local"))
  @ApiOperation({ summary: "Log in with email and password" })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: "Authenticated successfully",
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: "Validation failed" })
  @ApiUnauthorizedResponse({ description: "Invalid credentials" })
  login(
    @Body() _dto: LoginDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<LoginResult> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Log out the current session" })
  @ApiOkResponse({ description: "Logged out successfully" })
  logout(): { ok: true } {
    this.authService.logout();
    return { ok: true };
  }
}
