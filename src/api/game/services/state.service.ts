import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GameService } from 'src/core/modules/game/game.service';
import { SyncStateDto } from '../dto/sync.state.dto';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { BoosterService } from 'src/core/modules/booster';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

@Injectable()
export class ApiGameStateService {
  private logger = new Logger(ApiGameStateService.name);
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly boosterService: BoosterService,
  ) {}

  async sync(userId: string, dto: SyncStateDto) {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) throw new NotFoundException('User not found');
      if (!user.game_id) {
        user.game_id = (await this.gameService.createGame(dto))
          ._id as unknown as string;
        await user.save();
      }
      await this.gameService.sync(user.game_id, dto);
      return 'ok';
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getLatest(userId: string) {
    const user = await this.userService.findUserById(userId);
    this.logger.debug(user);
    if (!user) throw new NotFoundException('User not found');
    const game = await this.gameService.findGame(user.game_id);
    this.logger.debug(game);
    if (!game) {
      return {
        score: 100,
        tap_value: 1,
        multiplier: 1,
        energy: 100,
        max_energy: 100,
        energy_reduce: 0,
      };
    }
    this.logger.warn(Date.now() - new Date(game.updated_at).getTime());

    // #region Multitap Booster check
    const mutplitapBooster = user.boosters.filter(
      (booster) => booster.key === 'multitap',
    );
    const newMutlitapLevel = Math.max(
      ...mutplitapBooster.map((booster) => booster.level),
    );
    const multiplier =
      mutplitapBooster.length === 0 || !isFinite(newMutlitapLevel)
        ? 1
        : this.boosterService.VALUES.paid.multitap.level_value[
            newMutlitapLevel - 1
          ];
    this.logger.log(`[multitap] Max level: ${newMutlitapLevel}`);

    game.multiplier = multiplier;
    // #region Enegry Limit Increase
    const maxEnergyLimitIncreaseBoosters = user.boosters.filter(
      (booster) => booster.key === 'energy-limit-increase',
    );
    const energyLimitIncreaseMaxLevel = Math.max(
      ...maxEnergyLimitIncreaseBoosters.map((booster) => booster.level),
    );

    const max_energy =
      maxEnergyLimitIncreaseBoosters.length === 0 ||
      !isFinite(energyLimitIncreaseMaxLevel)
        ? this.boosterService.DEFAULT_VALUES['energy-limit-increase']
        : this.boosterService.VALUES.paid['energy-limit-increase'].level_value
            .slice(0, energyLimitIncreaseMaxLevel)
            .reduce(
              (acc, item) => item + acc,
              this.boosterService.DEFAULT_VALUES['energy-limit-increase'],
            );

    this.logger.log(max_energy);
    game.max_energy = max_energy;

    // #region Energy Recharge Time decrease
    const energyRechanrgeBoosters = user.boosters.filter(
      (booster) => booster.key === 'energy-recharge-decrease',
    );

    const energyRechanrgeMaxLevel = Math.max(
      ...energyRechanrgeBoosters.map((booster) => booster.level),
    );
    this.logger.log(`Index: ${energyRechanrgeMaxLevel}`);
    const energy_reduce =
      maxEnergyLimitIncreaseBoosters.length === 0 ||
      !isFinite(energyRechanrgeMaxLevel)
        ? this.boosterService.DEFAULT_VALUES['energy-recharge-decrease']
        : this.boosterService.VALUES.paid['energy-recharge-decrease']
            .level_value[energyRechanrgeMaxLevel - 1];
    game.energy_recharge_time_reduce = energy_reduce;

    const diff =
      ((Date.now() - new Date(game.updated_at).getTime()) /
        this.boosterService.DEFAULT_VALUES['default-recharge-time']) *
      (1 - energy_reduce);
    this.logger.log('----------');
    this.logger.log(energy_reduce);
    this.logger.log(diff);
    this.logger.log(Math.round(game.energy + diff));
    this.logger.log(max_energy);
    this.logger.log('----------');
    game.energy =
      game.energy + diff > max_energy
        ? max_energy
        : Math.round(game.energy + diff);
    game.save();
    return game.toObject();
  }
}
