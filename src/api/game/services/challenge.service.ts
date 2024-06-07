import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from 'src/core/modules/game/entities/game';

@Injectable()
export class ChallengeService implements OnModuleInit {
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<Game>,
  ) {}

  onModuleInit() {
    this.watchGameCollection();
  }

  public CHALLENGES = [
    {
      threshold: 5000,
      type: 'collect-5000',
      reward: '1000',
    },
  ];

  async watchGameCollection() {
    const changeStream = this.gameModel.collection.watch();

    changeStream.on('change', (next) => {
      console.log('Received Changes: ', next);
    });
  }
}
