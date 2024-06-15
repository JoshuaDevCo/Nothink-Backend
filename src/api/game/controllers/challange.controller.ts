import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/core/decorators/user.decorator';
import { AuthGuard } from 'src/core/modules/auth/guards/auth.guard';
import { WatchService } from '../watchers/watch.service';
import { ApiGameChallangeService } from '../services/challange.service';

@UseGuards(AuthGuard)
@Controller('challenge')
export class ApiGameChallengeController {
  constructor(
    private readonly watchService: WatchService,
    private readonly service: ApiGameChallangeService,
  ) {}

  @Get('all')
  handleGetAll() {
    return this.watchService.CHALLENGES;
  }

  @Get('completed')
  handleGetCompleted(@User('_id') userId: string) {
    return this.watchService.getCompleted(userId);
  }

  @Post('claim')
  handleClaimReward(
    @User('_id') userId: string,
    @Body('challengeId') challengeId: string,
  ) {
    return this.service.claimReward(userId, challengeId);
  }
}
