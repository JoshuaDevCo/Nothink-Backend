import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiStatService } from '../services/api-stat.service';
import { AuthGuard } from 'src/core/modules/auth/guards/auth.guard';
import { User } from 'src/core/decorators/user.decorator';

@Controller()
export class ApiStatController {
  constructor(private readonly service: ApiStatService) {}
  @Get('tappers')
  handleGetTappers() {
    // amount of user with balance > 0
    return this.service.getTappers();
  }
  @Get('table')
  handleGetRankTable() {
    // table of leaders 1 - 100 + user place
    return this.service.getRankTable();
  }
  @UseGuards(AuthGuard)
  @Get('placement/table')
  handleUserPlacementInRankTable(@User('_id') userId: string) {
    // table of leaders 1 - 100 + user place
    return this.service.getPlacementInTable(userId);
  }
  @UseGuards(AuthGuard)
  @Get('invited/table')
  handleGetInvitedRankTable(@User('_id') userId: string) {
    // table of leaders 1 - 100 + user place
    return this.service.getInvidedRankTable(userId);
  }
  @Get('score')
  handleGetScore() {
    // amount of clicked coins
    return this.service.getScore();
  }
}
