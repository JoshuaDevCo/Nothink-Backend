import { Module } from '@nestjs/common';
import { InviteModule } from 'src/core/modules/invites/invite.module';
import { ApiInviteController } from './controllers/api-invite.controller';
import { ApiInviteService } from './services/api-invite.service';

@Module({
  imports: [InviteModule],
  controllers: [ApiInviteController],
  providers: [ApiInviteService],
})
export class ApiInviteModule {}
