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

  async sign(initData: any, data: { user: any }) {
    try {
      // if (!('query_id' in data)) {
      //   initData =
      //     `user=${data.user}` +
      //     `&chat_instance=${data.chatInstance}` +
      //     `&chat_type=${data.chatType}` +
      //     `&auth_date=${new Date(data.authDate).getTime()}` +
      //     `&hash=${data.hash}`;
      // } else {
      //   initData =
      //     `query_id=${data.query_id}` +
      //     `&user=${data.user}` +
      //     `&auth_date=${new Date(data.authDate).getTime()}` +
      //     `&hash=${data.hash}`;
      // }
      if (!this.configService.get('AUTH_BYPASS')) {
        validate(initData, this.configService.getOrThrow('TELEGRAM_TOKEN'));
      }
      this.logger.log('Valid');
      const parsed = data.user;
      // { id: "123123" }
      this.logger.log('ID:', parsed.id);
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
