import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const allowAny = this.reflector.get<string[]>(
      'allow-any',
      context.getHandler(),
    );

    const authHeader: string = request.headers['authorization'];
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        this.logger.log(token);
        const user = await this.authService.verify(token);
        this.logger.log(user);
        request.user = user;
      } catch {}
    } else if (!allowAny) return false;
    else {
      request.user = null;
    }
    return true;
  }
}
