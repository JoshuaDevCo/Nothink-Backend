import { Injectable, OnModuleInit } from '@nestjs/common';
import { Challenge } from './enrtities';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChallengeService implements OnModuleInit {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<Challenge>,
  ) {}

  onModuleInit() {}

  findChallengeByUserId(user_id: string) {
    return this.challengeModel.find({ user_id });
  }

  addCompleteChallenge(user_id: string, type: string) {
    return this.challengeModel.insertMany({ user_id, type });
  }
}
