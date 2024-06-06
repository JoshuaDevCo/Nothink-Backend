import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiGameBoosterService } from '../services/booster.service';
import { User } from 'src/core/decorators/user.decorator';
import { AuthGuard } from 'src/core/modules/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('boosters')
export class ApiGameBoosterController {
  constructor(private readonly service: ApiGameBoosterService) {}
  @Get('list')
  handleGetList() {
    return this.service.getList();
  }
  @Get('mine')
  handleUsersBoosters(@User('_id') userId: string) {
    return this.service.getUsersList(userId);
  }

  @Post('use/:type')
  handleUseBooster(
    @User('_id') userId: string,
    @Param('type')
    type:
      | 'zen-power'
      | 'lotus-energy'
      | 'multitap'
      | 'energy-limit-increase'
      | 'energy-recharge-decrease'
      | 'autotapper',
  ) {
    return this.service.update(userId, type);
  }
}
