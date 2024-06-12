import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiInviteService } from '../services/api-invite.service';
import { AuthGuard } from 'src/core/modules/auth/guards/auth.guard';
import { User } from 'src/core/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller()
export class ApiInviteController {
  constructor(private readonly service: ApiInviteService) {}
  @Get('link')
  handleGetInviteLink(@User('_id') userId: string) {
    return this.service.getInviteLink(userId);
  }
}
