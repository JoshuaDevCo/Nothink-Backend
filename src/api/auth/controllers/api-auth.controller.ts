import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiAuthService } from '../services/api-auth.service';
import { InviteService } from 'src/core/modules/invites/services/invite.service';
import { isObjectIdOrHexString } from 'mongoose';
import { BotService } from 'src/core/modules/bot/bot.service';

@Controller('')
export class ApiAuthController {
  private logger = new Logger(ApiAuthController.name);
  constructor(
    private readonly service: ApiAuthService,
    private readonly inviteService: InviteService,
    private readonly botService: BotService,
  ) {}
  @Post('connect')
  async handleApiAuthConnect(
    @Body() params: { initDataRaw: string; data: any },
  ) {
    const { payload, user } = await this.service.sign(
      params.initDataRaw,
      params.data,
    );
    if (
      params.data.startParam &&
      isObjectIdOrHexString(params.data.startParam)
    ) {
      this.logger.warn('Checking invite...', params.data.startParam);
      try {
        const invite = await this.inviteService.acceptInvite(
          user._id.toString(),
          params.data.startParam,
        );
        await this.botService.sendInviteUsedNotification(
          invite.from,
          invite.id,
          `Congratulations! Your contact, ${
            (user.telegram_details as any).firstName ||
            user.telegram_details.username
          }, has used your invite link, and both of you have earned 1,000 coins!🪙 Keep sharing your link to spread the word and earn even more rewards. 🚀`,
        );
      } catch (error) {
        this.logger.error(error);
      }
    }

    return payload;
  }
}
