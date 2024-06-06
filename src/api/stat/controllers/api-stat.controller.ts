import { Controller, Get } from '@nestjs/common';
import { ApiStatService } from '../services/api-stat.service';

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
  @Get('score')
  handleGetScore() {
    // amount of clicked coins
    return this.service.getScore();
  }
}
