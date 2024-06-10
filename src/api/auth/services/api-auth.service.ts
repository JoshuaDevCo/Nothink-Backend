import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/core/modules/auth/auth.service';
import { InitDataParsed, validate } from '@tma.js/init-data-node';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiAuthService {
  private logger = new Logger(ApiAuthService.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async sign(data: {
    user: any;
    query_id: string;
    auth_date: number;
    hash: string;
  }) {
    try {
      const initDataString =
        `query_id=${data.query_id}` +
        `&user=${data.user}` +
        `&auth_date=${data.auth_date}` +
        `&hash=${data.hash}`;
      if (!this.configService.get('AUTH_BYPASS')) {
        validate(
          initDataString,
          this.configService.getOrThrow('TELEGRAM_TOKEN'),
        );
      }
      this.logger.log('Valid');
      const parsed = JSON.parse(data.user);
      // { id: "123123" }
      this.logger.log('ID:', parsed.id);
      let user = await this.userService.findUserByTelegramId(parsed.id);
      if (!user) {
        user = await this.userService.createUser(parsed.id);
      }
      user.telegram_details = parsed;
      await user.save();
      return this.authService.sign(user.toObject());
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
  async verify(data: string) {
    return this.authService.verify(data);
  }
}
