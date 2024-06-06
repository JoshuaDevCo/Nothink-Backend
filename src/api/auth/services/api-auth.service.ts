import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/core/modules/auth/auth.service';
import { validate } from '@tma.js/init-data-node';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';

@Injectable()
export class ApiAuthService {
  private logger = new Logger(ApiAuthService.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async sign(data: any) {
    try {
      const initDataString =
        `query_id=${data.query_id}` +
        `&user=${data.user}` +
        `&auth_date=${data.auth_date}` +
        `&hash=${data.hash}`;

      validate(
        initDataString,
        '6884723464:AAEcUMYmVNvjZJ-DwDb5EsjRGdIpB6R2tRw',
      );
      this.logger.log('Valid');
      const parsed = JSON.parse(data.user);
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
