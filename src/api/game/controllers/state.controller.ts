import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { SyncStateDto } from '../dto/sync.state.dto';
import { User } from 'src/core/decorators/user.decorator';
import { ApiGameStateService } from '../services/state.service';
import { AuthGuard } from 'src/core/modules/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('')
export class ApiGameStateController {
  private logger = new Logger(ApiGameStateController.name);
  constructor(private readonly service: ApiGameStateService) {}
  @Get('latest')
  handleGetLatest(@User('_id') userId: string) {
    this.logger.error('Receiving latest');
    return this.service.getLatest(userId);
  }

  @Post('sync')
  handleUpdateState(@Body() dto: SyncStateDto, @User('_id') userId: string) {
    this.logger.log(dto);
    return this.service.sync(userId, dto);
  }
}
