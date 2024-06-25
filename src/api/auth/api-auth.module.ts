import { Module } from '@nestjs/common';
import { ApiAuthService } from './services/api-auth.service';
import { ApiAuthController } from './controllers/api-auth.controller';
import { InviteModule } from 'src/core/modules/invites/invite.module';
import { BotModule } from 'src/core/modules/bot/bot.module';

@Module({
  imports: [InviteModule, BotModule],
  providers: [ApiAuthService],
  controllers: [ApiAuthController],
})
export class ApiAuthModule {}
