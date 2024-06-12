import { Module } from '@nestjs/common';
import { ApiGameBoosterController } from './controllers/booster.controller';
import { ApiGameBoosterService } from './services/booster.service';
import { ApiGameStateService } from './services/state.service';
import { BoosterModule } from 'src/core/modules/booster';
import { AuthModule } from 'src/core/modules/auth/auth.module';
import { GameModule } from 'src/core/modules/game/game.module';
import { ChallengeModule } from 'src/core/modules/challange/challenge.module';
import { ApiGameStateController } from './controllers/state.controller';
import { ApiChallengeService } from './services/challenge.service';
@Module({
  imports: [AuthModule, BoosterModule, GameModule, ChallengeModule],
  controllers: [ApiGameBoosterController, ApiGameStateController],
  providers: [ApiGameBoosterService, ApiGameStateService, ApiChallengeService],
})
export class ApiGameModule {}
