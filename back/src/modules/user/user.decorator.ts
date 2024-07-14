import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./schemas/user.schema";

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      return null;
    }
    const u = new User();
    return {
        uid: request.user.uid,
        email: request.user.email,
        name: request.user.name,
    }
  }
);