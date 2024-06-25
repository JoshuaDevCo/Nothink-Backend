import { Injectable, Logger } from '@nestjs/common';
import { GameService } from 'src/core/modules/game/game.service';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { ChallengeService } from 'src/core/modules/challange/challenge.service';
import { IChallange } from '../types/challange.types';
import { InviteService } from 'src/core/modules/invites/services/invite.service';
import { CHALLENGES } from '../constants/challenges';
import { BotService } from 'src/core/modules/bot/bot.service';

@Injectable()
export class WatchInviteChallengeService {
  private logger = new Logger(WatchInviteChallengeService.name);
  constructor(
    private readonly userService: UserService,
    private readonly challengeService: ChallengeService,
    private readonly inviteService: InviteService,
    private readonly botService: BotService,
  ) {}

  async watch() {
    this.logger.debug('Start watching');
    const changeStream = this.inviteService.getCollection().watch();

    changeStream.on('change', async (update) => {
      // Getting the updated score field.
      this.logger.debug(update.operationType);
      if (update.operationType != 'update') return;
      const acceptedBy = update.updateDescription.updatedFields['accepted_by'];

      if (!acceptedBy) return;
      const lastAccepter = acceptedBy.splice(-1)[0];

      const inviteId = update.documentKey._id.toString();

      //   // Getting game and user information.
      const userId = await this.inviteService.getUserIdByInviteId(inviteId);
      const user = await this.userService.findUserById(userId);
      //   // this.logger.debug(`User found: ${!user}`);
      if (!user) return;

      //   // Getting which challenges can be completed.
      const detectedChallengeList = CHALLENGES.invite.filter(
        (challenge) =>
          challenge.type.includes('invite-') &&
          acceptedBy.length >= challenge.threshold,
      );
      this.logger.debug(detectedChallengeList);

      //   // Getting the list of challengs that the user have completed.
      if (lastAccepter) {
        const invited = await this.userService.findUserById(lastAccepter);
        this.botService.sendMessageToUser(
          user.id,
          `Congratulations! Your contact, ${
            (invited.telegram_details as any).firstName ||
            invited.telegram_details.username
          }, has used your invite link, and both of you have earned 1,000 coins!🪙 Keep sharing your link to spread the word and earn even more rewards. 🚀`,
        );
      }

      const completeChallenges =
        await this.challengeService.findChallengeByUserId(user.id);

      const completeChallengeTypes = completeChallenges.map(
        (challenge) => challenge.type,
      );

      // Filtering out new challenges and getting the reward sum of it.

      for (const challenge of detectedChallengeList) {
        if (!completeChallengeTypes.includes(challenge.type)) {
          if (!challenge.type) return;
          await this.challengeService.addCompleteChallenge(
            user.id,
            challenge.type,
          );
          this.logger.warn(`Challenge complete: ${challenge.type}`);
        }
      }
    });
  }

  public getCompleted(userId: string) {
    return this.challengeService.getCompletedChallanges(userId);
  }
}
