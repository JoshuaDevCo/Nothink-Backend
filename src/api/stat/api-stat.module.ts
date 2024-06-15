import { Module } from '@nestjs/common';
import { ApiStatController } from './controllers/api-stat.controller';
import { ApiStatService } from './services/api-stat.service';
import { GameModule } from 'src/core/modules/game/game.module';
import { InviteModule } from 'src/core/modules/invites/invite.module';

@Module({
  imports: [GameModule, InviteModule],
  controllers: [ApiStatController],
  providers: [ApiStatService],
})
export class ApiStatModule {}
