import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { INVITE_TEXT } from './bot.constants';

const WELCOME_TEXT = `*Welcome to NO\\-THINK COIN:*

The Future of Easy Earning\\!
Don’t miss out on this exciting opportunity\\! NO\\-COIN is the new digital coin designed for everyone\\. No complex setups, no investments needed \\- just pure, simple fun\\.

*How to Get Started*:
1\\. *Invite Friends*: Share the joy and invite your friends\\. Both of you earn 1\\.000 coins when they join using your invite link\\!
2\\. *Click Play*: Simply click the golden sign to start mining coins\\. The more you click, the more you earn\\!`;

const makeInviteLink = (id: string) => {
  const text = INVITE_TEXT;
  return `https://t.me/share/url?url=https://t.me/no_think_coin_bot/startapp?startapp=${id}&text=${text}`;
};

@Injectable()
export class BotService implements OnModuleInit {
  constructor(@InjectBot() private readonly bot: Telegraf) {}
  onModuleInit() {
    this.bot.start((ctx) => {
      console.log('received start command');
      return ctx.sendMessage(WELCOME_TEXT, {
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Invite friends', url: makeInviteLink('test') }],
            [
              {
                text: 'Play',
                web_app: {
                  url: 'https://t.me/no_think_coin_bot/startapp',
                },
              },
            ],
            // [{ text: 'Read the rules', callback_data: 'Rules' }],
          ],
        },
      });
    });
  }
}
