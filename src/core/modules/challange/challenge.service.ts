import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameService } from 'src/core/modules/game/game.service';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';

@Injectable()
export class ChallengeService implements OnModuleInit {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
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

    changeStream.on('change', (update) => {
      console.log('Received Changes: ', update);
      const score = update['updateDescription']['updatedFields']['score'];
      if (score != undefined) {
        console.log(score);
        const completeChallenge = this.CHALLENGES.filter(
          (challenge) =>
            challenge.type.includes('collect-') && challenge.threshold >= score,
        )[0];
        if (completeChallenge == undefined) return;
        const gameId = update['documentKey']['_id]'];
        const game = this.gameService.findGame(gameId);
        game.updateOne({ score: score + completeChallenge.reward });
      }
    });
  }
}
