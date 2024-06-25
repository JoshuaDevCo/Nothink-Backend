import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { InviteModule } from '../invites/invite.module';

@Module({
  imports: [TelegrafModule, InviteModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
