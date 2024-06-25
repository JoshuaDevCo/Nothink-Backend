import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GameService } from 'src/core/modules/game/game.service';
import { SyncStateDto } from '../dto/sync.state.dto';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { BoosterService } from 'src/core/modules/booster';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { UserDocument } from 'src/core/modules/auth/entities/user';
import { GameDocument } from 'src/core/modules/game/entities/game';
import { ConfigService } from '@nestjs/config';
import { InviteService } from 'src/core/modules/invites/services/invite.service';

@Injectable()
export class ApiGameStateService {
  private logger = new Logger(ApiGameStateService.name);
  autotapperInactivityPeriod: number;
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly boosterService: BoosterService,
    private readonly inviteService: InviteService,
    private readonly configService: ConfigService,
  ) {
    this.autotapperInactivityPeriod = Number(
      this.configService.get('BOOSTER_AUTOTAPPER_INACTIVITY_PERIOD') || '15',
    );
  }

  async sync(userId: string, dto: SyncStateDto) {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) throw new NotFoundException('User not found');
      const isUserInvited = await this.inviteService.isInvited(
        user._id.toString(),
      );
      if (!user.game_id) {
        user.game_id = (await this.gameService.createGame(dto, isUserInvited))
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

  private applyMultitap(user: UserDocument) {
    const mutplitapBooster = user.boosters.filter(
      (booster) => booster.key === 'multitap',
    );
    const newMutlitapLevel = Math.max(
      ...mutplitapBooster.map((booster) => booster.level),
    );
    return mutplitapBooster.length === 0 || !isFinite(newMutlitapLevel)
      ? 1
      : this.boosterService.VALUES.paid.multitap.level_value[
          newMutlitapLevel - 1
        ];
  }

  private applyMaxEnergyBoost(user: UserDocument) {
    const maxEnergyLimitIncreaseBoosters = user.boosters.filter(
      (booster) => booster.key === 'energy-limit-increase',
    );
    const energyLimitIncreaseMaxLevel = Math.max(
      ...maxEnergyLimitIncreaseBoosters.map((booster) => booster.level),
    );

    return maxEnergyLimitIncreaseBoosters.length === 0 ||
      !isFinite(energyLimitIncreaseMaxLevel)
      ? this.boosterService.DEFAULT_VALUES['energy-limit-increase']
      : this.boosterService.VALUES.paid['energy-limit-increase'].level_value
          .slice(0, energyLimitIncreaseMaxLevel)
          .reduce(
            (acc, item) => item + acc,
            this.boosterService.DEFAULT_VALUES['energy-limit-increase'],
          );
  }

  private applyEnergyRechargeBoost(user: UserDocument) {
    const energyRechanrgeBoosters = user.boosters.filter(
      (booster) => booster.key === 'energy-recharge-decrease',
    );

    const energyRechanrgeMaxLevel = Math.max(
      ...energyRechanrgeBoosters.map((booster) => booster.level),
    );
    this.logger.log(`Index: ${energyRechanrgeMaxLevel}`);
    return energyRechanrgeBoosters.length === 0 ||
      !isFinite(energyRechanrgeMaxLevel)
      ? this.boosterService.DEFAULT_VALUES['energy-recharge-decrease']
      : this.boosterService.VALUES.paid['energy-recharge-decrease'].level_value[
          energyRechanrgeMaxLevel - 1
        ];
  }

  private applyAutotapper(user: UserDocument, game: GameDocument) {
    const autoTapperBooster = user.boosters.filter(
      (booster) => booster.key === 'autotapper',
    );
    if (autoTapperBooster.length === 0) return 0;
    const lastActivity = new Date(game.updated_at).getTime();
    const diff =
      (Date.now() - lastActivity) / 1000 - this.autotapperInactivityPeriod;
    this.logger.warn('------------');
    this.logger.warn('Diff (s): ' + diff);
    this.logger.warn(
      'Last activity at:\t' + new Date(lastActivity).toLocaleString(),
    );
    this.logger.warn('------------');
    if (diff <= 0) return 0;
    return Math.round((game.tap_value * game.multiplier * diff) / 2);
  }

  async getLatest(userId: string) {
    const user = await this.userService.findUserById(userId);
    // this.logger.debug(user);
    if (!user) throw new NotFoundException('User not found');
    const game = await this.gameService.findGame(user.game_id);
    // this.logger.debug(game);

    if (!game) {
      const wasInvited = await this.inviteService.isInvited(user.id);
      return {
        score: wasInvited ? 1000 : 100,
        tap_value: 1,
        multiplier: 1,
        energy: 100,
        max_energy: 100,
        energy_reduce: 0,
      };
    }
    this.logger.warn(Date.now() - new Date(game.updated_at).getTime());
    const claimed = await this.inviteService.claim(userId);
    // #region Multitap Booster check
    game.multiplier = this.applyMultitap(user);
    // #region Enegry Limit Increase
    game.max_energy = this.applyMaxEnergyBoost(user);
    // #region Energy Recharge Time decrease
    game.energy_recharge_time_reduce = this.applyEnergyRechargeBoost(user);
    const diff =
      ((Date.now() - new Date(game.updated_at).getTime()) /
        this.boosterService.DEFAULT_VALUES['default-recharge-time']) *
      (1 - game.energy_recharge_time_reduce);
    this.logger.log('----------');
    this.logger.log(`Recharge:\t${game.energy_recharge_time_reduce}`);
    this.logger.log(`Diff:\t${diff}`);
    this.logger.log(`Enegry Acc:\t${Math.round(game.energy + diff)}`);
    this.logger.log(`Max Energy:\t${game.max_energy}`);
    game.energy =
      game.energy + diff > game.max_energy
        ? game.max_energy
        : Math.round(game.energy + diff);

    const autotapped = this.applyAutotapper(user, game);
    this.logger.log(`Autotapped:\t${autotapped}`);
    this.logger.log('----------');
    game.score += autotapped;
    await game.save();
    return {
      ...game.toObject(),
      auto_tapped: autotapped,
      invites_claimed: claimed,
    };
  }
}
