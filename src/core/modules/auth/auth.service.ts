import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  protected secret: string;
  constructor(private readonly userService: UserService) {
    this.secret = 'secret-token';
  }
  sign(data: string | object | Buffer) {
    return sign(data, this.secret, {
      expiresIn: 60 * 60 * 3,
      algorithm: 'HS256',
    });
  }
  async verify(jwt: string) {
    try {
      const payload = verify(jwt, this.secret);
      if (typeof payload === 'string') throw new Error('Bad credits');
      this.logger.log(payload);
      const user = payload;
      return user;
    } catch (error) {
      return null;
    }
  }
  //   connect(params) {}
}
