import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booster } from './entities/booster';
import { Model } from 'mongoose';

@Injectable()
export class BoosterService {
  constructor(
    @InjectModel(Booster.name) private readonly boosterModel: Model<Booster>,
  ) {}

  onModuleInit() {
    this.initBoosters();
  }

  public TYPES = {
    daily: ['zen-power', 'lotus-energy'],
    paid: ['multitap', 'energy-limit-increase', 'energy-recharge-decrease'],
  } as const;
  public VALUES = {
    paid: {
      multitap: { level_value: [2, 3, 4, 5, 6, 7, 8, 9, 10, 20] },
      'energy-limit-increase': {
        level_value: [50, 100, 150, 200, 250, 500, 750, 1000, 1500, 2000],
      },
      'energy-recharge-decrease': {
        level_value: [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8],
      },
    },
  } as const;

  public DEFAULT_VALUES = {
    multitap: 1,
    'energy-limit-increase': 100,
    'energy-recharge-decrease': 0,
    'default-recharge-time': 3000,
  };

  getAll() {
    return this.boosterModel.find({});
  }
  getDailyAll() {
    return this.boosterModel.find({ type: 'daily' });
  }
  // when we want to buy a booster
  // when game is staring

  /**
   * Only paid type of boosters allowed
   * @param boosterType
   * @param currentLevel
   * @returns
   */
  getNextLevelBooster(
    type: 'paid' | 'daily',
    key: string,
    currentLevel: number,
  ) {
    if (type === 'daily') {
      return this.boosterModel.findOne({
        type: 'daily',
        key,
      });
    }
    return this.boosterModel.findOne({
      type: 'paid',
      key,
      level: currentLevel + 1,
    });
  }

  getCurrentTypeBoosters(type: string) {
    return this.boosterModel.find({
      type,
    });
  }

  async initBoosters() {
    const boosterAmount = await this.boosterModel.countDocuments();
    if (boosterAmount > 0) return;
    const daily = this.TYPES.daily.flatMap((key) =>
      Array.from(new Array(1)).map(
        (_, i) =>
          new this.boosterModel({
            type: 'daily',
            key,
            level: i + 1,
            max_usages: 3,
          }),
      ),
    );
    const paid = this.TYPES.paid.flatMap((key) =>
      Array.from(new Array(10)).map(
        (_, i) => new this.boosterModel({ type: 'paid', key, level: i + 1 }),
      ),
    );

    await Promise.all([
      ...daily.map((d) => d.save()),
      ...paid.map((d) => d.save()),
      new this.boosterModel({
        type: 'paid',
        key: 'autotapper',
        level: 1,
      }).save(),
    ]);
  }
}
