import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  UserDocument,
  User as UserEntity,
} from '../modules/auth/entities/user';

export const User = createParamDecorator(
  (key: keyof UserDocument, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!key) {
      return req.user;
    }
    return req.user[key];
  },
);
