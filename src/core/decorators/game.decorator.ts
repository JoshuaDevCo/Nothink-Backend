import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Game = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (req.game) {
      return req.game;
    }
    return null;
  },
);
