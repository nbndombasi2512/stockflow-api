import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { SafeUser } from "../auth.service";

interface RequestWithUser {
  user: SafeUser;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SafeUser => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
