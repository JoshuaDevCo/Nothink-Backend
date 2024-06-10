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
  ] as const;

  async watchGameCollection() {
    const changeStream = this.gameService.getCollection().watch();

    changeStream.on('change', async (update) => {
      console.log('Received Changes: ', update);
      const score = update['updateDescription']['updatedFields']['score'];
      if (score != undefined) {
        const completeChallengeList = this.CHALLENGES.filter(
          (challenge) =>
            challenge.type.includes('collect-') && score >= challenge.threshold,
        );
        if (completeChallengeList == undefined) return;
        const gameId = update['documentKey']['_id'];
        const user = await this.userService.findUserByGameId(gameId);
        if (user == undefined) return;
        console.log(user.id);
        const completeChallenges =
          await this.challengeService.findChallengeByUserId(user.id);
        const completeChallengeTypes = completeChallenges.map(
          (challenge) => challenge.type,
        );
        console.log(completeChallengeList);
        console.log(completeChallengeTypes);
        let rewardSum = 0;
        completeChallengeList.forEach((challenge) => {
          if (!completeChallengeTypes.includes(challenge.type)) {
            console.log(challenge.reward, Number(challenge.reward));
            rewardSum += Number(challenge.reward);
            this.challengeService.addCompleteChallenge(user.id, challenge.type);
          }
        });
        console.log(rewardSum);
        console.log(await this.gameService.addScore(gameId, rewardSum));
        // game.updateOne({ score: score + completeChallenge.reward });
      }
    });
  }
}
