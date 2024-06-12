import { Injectable } from '@nestjs/common';
import { InviteService } from 'src/core/modules/invites/services/invite.service';

@Injectable()
export class ApiInviteService {
  constructor(private readonly inviteService: InviteService) {}

  async getInviteLink(userId: string) {
    const storedInviteLink = await this.inviteService.findInviteLink(userId);
    if (storedInviteLink) return storedInviteLink;
    return this.inviteService.createInviteLink(userId);
  }
}
