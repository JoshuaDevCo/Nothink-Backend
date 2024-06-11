import { Injectable, OnModuleInit } from '@nestjs/common';
import { GameService } from 'src/core/modules/game/game.service';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { ChallengeService } from 'src/core/modules/challange/challenge.service';

@Injectable()
export class ApiChallengeService implements OnModuleInit {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly challengeService: ChallengeService,
  ) {}

  onModuleInit() {
    this.watchGameCollection();
  }

  public CHALLENGES = [
    {
      threshold: 2000,
      type: 'collect-2000',
      reward: '250',
    },
    {
      threshold: 3000,
      type: 'collect-2500',
      reward: '500',
    },
    {
      threshold: 5000,
      type: 'collect-5000',
      reward: '1000',
    },
    {
      threshold: 10000,
      type: 'collect-10000',
      reward: '2000',
    },
    {
      threshold: 20000,
      type: 'collect-10000',
      reward: '2000',
    },
  ] as const;

  async watchGameCollection() {
    const changeStream = this.gameService.getCollection().watch();

    changeStream.on('change', async (update) => {
      // Getting the updated score field.
      if (update.operationType != 'update') return;
      const score = update.updateDescription.updatedFields['score'];

      // Getting game and user information.
      const gameId = update.documentKey._id.toString();
      const user = await this.userService.findUserByGameId(gameId);
      if (!user) return;

      // Getting which challenges can be completed.
      let detectedChallengeList = [],
        completeChallengeTypes = [];
      if (!score) {
        detectedChallengeList = this.CHALLENGES.filter(
          (challenge) =>
            challenge.type.includes('collect-') && score >= challenge.threshold,
        );
      }

      // Getting the list of challengs that the user have completed.
      const completeChallenges =
        await this.challengeService.findChallengeByUserId(user.id);
      completeChallengeTypes = completeChallenges.map(
        (challenge) => challenge.type,
      );

      // Filtering out new challenges and getting the reward sum of it.
      let rewardSum = 0;
      for (let i = 0; i < detectedChallengeList.length; i++) {
        const challenge = detectedChallengeList[i];
        if (!completeChallengeTypes.includes(challenge.type)) {
          if (!challenge.type) return;
          rewardSum += Number(challenge.reward);
          await this.challengeService.addCompleteChallenge(
            user.id,
            challenge.type,
          );
          console.log(`Challenge complete: ${challenge.type}`);
        }
      }

      // Giving reward.
      if (rewardSum > 0) {
        await this.gameService.addScore(gameId, rewardSum);
        console.log(`Reward given: ${rewardSum}`);
      }
    });
  }
}
