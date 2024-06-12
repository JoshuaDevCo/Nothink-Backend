import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { BoosterService } from 'src/core/modules/booster';
import { GameService } from 'src/core/modules/game/game.service';

@Injectable()
export class ApiGameBoosterService {
  private logger = new Logger(ApiGameBoosterService.name);
  constructor(
    private readonly boosterService: BoosterService,
    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}

  async getList() {
    const res: Record<string, unknown[]> = {};
    const boosters = await this.boosterService.getAll();
    for (const booster of boosters) {
      if (res[booster.key]) {
        res[booster.key].push(booster);
      } else {
        res[booster.key] = [booster];
      }
    }
    this.logger.log(res);
    return res;
  }

  async getDailyList(userId: string) {
    const res: Record<string, unknown[]> = {};
    const boosters = await this.boosterService.getDailyAll();
    this.logger.warn(boosters);
    for (const booster of boosters) {
      if (res[booster.key]) {
        res[booster.key].push({
          ...booster.toObject(),
          usages: booster.usages?.[userId] || 0,
        });
      } else {
        res[booster.key] = [
          {
            ...booster.toObject(),
            usages: booster.usages?.[userId] || 0,
          },
        ];
      }
    }
    this.logger.debug(res);
    return res;
  }

  async getUsersList(userId: string) {
    const user = await this.userService.findUserById(userId);

    const res: Record<string, unknown[]> = {};
    const boosters = user.boosters;
    for (const booster of boosters) {
      if (res[booster.key]) {
        res[booster.key].push(booster);
      } else {
        res[booster.key] = [booster];
      }
    }
    return res;
  }

  // type [bought by type] -> find max level of booster
  async update(
    userId: string,
    type: (typeof this.boosterService.TYPES)['paid' | 'daily'][number],
  ): Promise<boolean> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');
    const isDaily = this.boosterService.TYPES.daily.includes(
      type as 'zen-power' | 'lotus-energy',
    );
    const boughtBoosters = user.boosters.filter(
      (booster) => booster.key === type,
    );
    const level = Math.max(...boughtBoosters.map((b) => b.level));
    this.logger.log('Current booster level ' + level);

    const nextBooster = await this.boosterService.getNextLevelBooster(
      isDaily ? 'daily' : 'paid',
      type,
      boughtBoosters.length === 0 ? 0 : level,
    );
    this.logger.debug(nextBooster);

    const game = await this.gameService.findGame(user.game_id);
    if (!game) {
      throw new Error('Game is not found');
    }

    if (isDaily) {
      this.logger.log(type);
      // reduce usage amount
      const oldUsages = nextBooster.usages
        ? nextBooster.usages[user.telegram_id] || 0
        : 0;
      if (oldUsages >= nextBooster.max_usages) {
        throw new BadRequestException('Reached daily limit of usage');
      }
      if (!nextBooster.usages) {
        nextBooster.usages = {};
      }
      if (nextBooster.usages[user.telegram_id] + 1 > nextBooster.max_usages)
        return false;
      nextBooster.usages = {
        ...nextBooster.usages,
        [user.telegram_id]: oldUsages + 1,
      };
      this.logger.log('Usages');
      this.logger.log(nextBooster);
      this.logger.log(nextBooster.usages[user.telegram_id]);
      await nextBooster.save();
      this.logger.debug('saved');
      if (type === 'lotus-energy') {
        game.energy = game.max_energy;
        await game.save();
      }
      return true;
    }
    if (game.score < nextBooster.price) {
      throw new Error('Not enought balance');
    }
    game.score -= nextBooster.price || 0;
    user.boosters.push(nextBooster);
    await game.save();
    await user.save();
    return false;
    // find booster with max level and update booster list | reduce coins
  }
}
