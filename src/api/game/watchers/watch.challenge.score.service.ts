import { Injectable, Logger } from '@nestjs/common';
import { GameService } from 'src/core/modules/game/game.service';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { ChallengeService } from 'src/core/modules/challange/challenge.service';
import { IChallange } from '../types/challange.types';
import { CHALLENGES } from '../constants/challenges';

@Injectable()
export class WatchScoreChallengeService {
  private logger = new Logger(WatchScoreChallengeService.name, {
    timestamp: false,
  });
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly challengeService: ChallengeService,
  ) {}

  async watch() {
    this.logger.debug('Start watching');
    const changeStream = this.gameService.getCollection().watch();

    changeStream.on('change', async (update) => {
      // Getting the updated score field.
      this.logger.debug(update.operationType);
      if (update.operationType != 'update') return;
      const score = update.updateDescription.updatedFields['score'];
      this.logger.warn(score, update.documentKey._id);

      // Getting game and user information.
      const gameId = update.documentKey._id.toString();
      const user = await this.userService.findUserByGameId(gameId);
      // this.logger.debug(`User found: ${!user}`);
      if (!user) return;

      // Getting which challenges can be completed.
      let detectedChallengeList = [],
        completeChallengeTypes = [];
      if (score) {
        detectedChallengeList = CHALLENGES.score.filter(
          (challenge) =>
            challenge.type.includes('collect-') && score >= challenge.threshold,
        );
      }
      // this.logger.debug(detectedChallengeList);

      // Getting the list of challengs that the user have completed.
      const completeChallenges =
        await this.challengeService.findChallengeByUserId(user.id);
      completeChallengeTypes = completeChallenges.map(
        (challenge) => challenge.type,
      );

      // Filtering out new challenges and getting the reward sum of it.
      // Won't work properly dueto await in for loop
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
