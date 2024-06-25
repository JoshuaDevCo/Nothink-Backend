import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { GameService } from 'src/core/modules/game/game.service';
import { InviteService } from 'src/core/modules/invites/services/invite.service';

@Injectable()
export class ApiStatService {
  private logger = new Logger(ApiStatService.name);
  constructor(
    private readonly userService: UserService,
    private readonly gameService: GameService,
    private readonly inviteService: InviteService,
  ) {}
  getTappers() {
    // amount of user with balance > 0
    return this.userService.getTappers();
  }
  async getRankTable() {
    // table of leaders 1 - 100 + user place
    const res = await this.userService.getRankTable();
    // this.logger.debug(res);
    return res;
  }
  async getPlacementInTable(userId: string) {
    // table of leaders 1 - 100 + user place
    const res = await this.userService.getUserPlacement(userId);
    // this.logger.debug(res);
    return res[0]?.rank || 1;
  }
  async getInvidedRankTable(userId: string) {
    this.logger.log(`User ID: ${userId}`);
    const ids = await this.inviteService.getInvited(userId);
    // table of leaders 1 - 100 + user place
    this.logger.log(ids);
    const res = await this.userService.getInvidedRankTable(ids);
    // this.logger.debug(res);
    return res;
  }
  async getScore() {
    return (await this.gameService.getScore()).reduce(
      (count, game) => count + game.score,
      0,
    );
    // amount of clicked coins
  }
}
