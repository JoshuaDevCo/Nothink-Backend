import { Injectable, Logger } from '@nestjs/common';
import { Challenge, ChallengeDocument } from './enrtities';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChallengeService {
  private logger = new Logger(ChallengeService.name);
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<Challenge>,
  ) {}

  findChallengeByUserId(userId: string) {
    return this.challengeModel.find({ user_id: userId });
  }

  addCompleteChallenge(userId: string, type: string) {
    // TODO:
    // as i remember insertMany will throw error if collection empty or doesn't exsits
    try {
      return this.challengeModel.insertMany({ user_id: userId, type });
    } catch (error) {
      this.logger.error(error);
      return;
    }
  }

  getCompletedChallanges(userId: string) {
    return this.challengeModel.find({ user_id: userId });
  }

  async claim(
    userId: string,
    challengeId: string,
  ): Promise<[false, null] | [true, ChallengeDocument]> {
    const challenge = await this.challengeModel.findOne({
      _id: challengeId,
      user_id: userId,
    });
    if (!challenge) throw new Error('Challenge not found');
    console.log(challenge);
    if (challenge.claimed) return [false, null];
    challenge.claimed = true;
    await challenge.save();
    return [true, challenge];
  }
}
