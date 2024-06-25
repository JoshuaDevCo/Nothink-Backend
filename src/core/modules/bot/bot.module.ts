import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';

@Module({
  imports: [TelegrafModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
