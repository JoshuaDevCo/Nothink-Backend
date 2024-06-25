import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AuthService } from 'src/core/modules/auth/auth.service';
import { InitDataParsed, validate } from '@tma.js/init-data-node';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiAuthService implements OnModuleInit {
  private logger = new Logger(ApiAuthService.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.logger.log('AUTH_BYPASS', this.configService.get('AUTH_BYPASS'));
  }

  async sign(initData: any, data: { user: any }) {
    try {
      if (!this.configService.get('AUTH_BYPASS')) {
        validate(initData, this.configService.getOrThrow('TELEGRAM_TOKEN'));
      }
      const parsed = data.user;
      this.logger.log('Telegram ID:', parsed.id);
      let user = await this.userService.findUserByTelegramId(parsed.id);
      if (!user) {
        user = await this.userService.createUser(parsed.id);
      }
      user.telegram_details = parsed;
      await user.save();
      return { payload: this.authService.sign(user.toObject()), user };
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
  async verify(data: string) {
    return this.authService.verify(data);
  }
}
