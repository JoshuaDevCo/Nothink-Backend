import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiAuthService } from '../services/api-auth.service';
import { InviteService } from 'src/core/modules/invites/services/invite.service';
import { isObjectIdOrHexString } from 'mongoose';

@Controller('')
export class ApiAuthController {
  private logger = new Logger(ApiAuthController.name);
  constructor(
    private readonly service: ApiAuthService,
    private readonly inviteService: InviteService,
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
      this.logger.warn('Checking invite...');
      try {
        await this.inviteService.acceptInvite(
          user._id.toString(),
          params.data.startParam,
        );
      } catch (error) {
        this.logger.error(error);
      }
    }

    return payload;
  }
}
