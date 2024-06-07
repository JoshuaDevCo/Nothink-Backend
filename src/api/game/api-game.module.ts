import { Module } from '@nestjs/common';
import { ApiGameBoosterController } from './controllers/booster.controller';
import { ApiGameBoosterService } from './services/booster.service';
import { ApiGameStateService } from './services/state.service';
import { BoosterModule } from 'src/core/modules/booster';
import { GameModule } from 'src/core/modules/game/game.module';
import { UserModule } from 'src/core/modules/auth/modules/user/user.module';
import { ApiGameStateController } from './controllers/state.controller';
import { ChallengeService } from './services/challenge.service';

@Module({
  imports: [BoosterModule, GameModule, UserModule],
  controllers: [ApiGameBoosterController, ApiGameStateController],
  providers: [ApiGameBoosterService, ApiGameStateService, ChallengeService],
})
export class ApiGameModule {}
