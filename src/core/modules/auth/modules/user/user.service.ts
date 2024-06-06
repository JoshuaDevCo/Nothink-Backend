import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';
import { User } from '../../entities/user';
import { Game } from 'src/core/modules/game/entities/game';
import { Booster } from 'src/core/modules/booster';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
    @InjectModel(Booster.name) private readonly boosterModel: Model<Booster>,
  ) {}

  createUser(telegram_id: string) {
    const instance = new this.userModel({
      telegram_id,
      boosters: [],
    });
    return instance.save();
  }

  findUserById(userId: string) {
    return this.userModel
      .findById(userId)
      .populate('boosters', null, this.boosterModel);
  }
  findUserByTelegramId(telegram_id: string) {
    return this.userModel.findOne({ telegram_id });
  }
  getTappers() {
    return this.userModel.countDocuments();
  }

  async getRankTable() {
    return this.userModel.aggregate([
      {
        $addFields: {
          gameIdObjectId: { $toObjectId: '$game_id' },
        },
      },
      {
        $lookup: {
          from: 'games',
          localField: 'gameIdObjectId',
          foreignField: '_id',
          as: 'game',
        },
      },
      {
        $unwind: '$game',
      },
      {
        $sort: { 'game.score': -1 }, // sort in descending order
      },
      {
        $project: {
          _id: 1,
          name: 1,
          game_id: 1,
          telegram_details: 1,
          score: '$game.score',
        },
      },
      {
        $limit: 100,
      },
    ]);
  }
}
