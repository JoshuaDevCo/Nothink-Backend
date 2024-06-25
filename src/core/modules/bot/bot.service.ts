import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { INVITE_TEXT } from './bot.constants';
import { UserService } from '../auth/modules/user/user.service';
import { InviteService } from '../invites/services/invite.service';

const WELCOME_TEXT = `*Welcome to NO\\-THINK COIN:*

The Future of Easy Earning\\!
Don’t miss out on this exciting opportunity\\!
NO\\-THINK COIN is the new digital coin designed for everyone\\. No complex setups, no investments needed \\- just pure, simple fun\\.

*How to Get Started*:
1\\. *Invite Friends*: Share the joy and invite your friends\\. Both of you earn 1\\.000 coins when they join using your invite link\\!
2\\. *Click Play*: Simply click the golden sign to start mining coins\\. The more you click, the more you earn\\!`;

const makeInviteLink = (id: string) => {
  const text = INVITE_TEXT;
  return `https://t.me/share/url?url=https://t.me/no_think_coin_bot/startapp?startapp=${id}&text=${text}`;
};

@Injectable()
export class BotService implements OnModuleInit {
  private readonly logger = new Logger(BotService.name);
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly userService: UserService,
    private readonly inviteService: InviteService,
  ) {}
  onModuleInit() {
    this.bot.start(async (ctx) => {
      console.log('received start command');
      const chat_id = ctx.chat.id;
      const telegram_details = ctx.message.from;
      const telegram_id = ctx.message.from.id;
      let invite;
      try {
        let user = await this.userService.findUserByTelegramId(telegram_id);
        if (!user) {
          user = await this.userService.createUser(telegram_id);
          user.telegram_details = { ...telegram_details };
          user.chat_id = chat_id;
          await user.save();
        } else {
          user.telegram_details = { ...telegram_details };
          user.chat_id = chat_id;
          await user.save();
        }
        invite = await this.inviteService.findInviteLink(user.id);
      } catch (error) {
        this.logger.error(error);
      }
      return ctx.sendMessage(WELCOME_TEXT, {
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Invite friends', url: makeInviteLink(invite._id) }],
            [
              {
                text: 'Play',
                url: 'https://t.me/no_think_coin_bot/startapp',
              },
            ],
            // [{ text: 'Read the rules', callback_data: 'Rules' }],
          ],
        },
      });
    });
  }

  async sendInviteUsedNotification(
    userId: string,
    inviteId: string,
    message: string,
  ) {
    const user = await this.userService.findUserById(userId);
    if (!user) return;
    if (!user.chat_id) return;
    this.bot.telegram.sendMessage(user.chat_id, message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Invite friends', url: makeInviteLink(inviteId) }],
          // [{ text: 'Read the rules', callback_data: 'Rules' }],
        ],
      },
    });
  }
}
