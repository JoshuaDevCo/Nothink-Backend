import { Module } from '@nestjs/common';
import { ApiGameBoosterController } from './controllers/booster.controller';
import { ApiGameBoosterService } from './services/booster.service';
import { ApiGameStateService } from './services/state.service';
import { BoosterModule } from 'src/core/modules/booster';
import { GameModule } from 'src/core/modules/game/game.module';
import { ChallengeModule } from 'src/core/modules/challange/challenge.module';
import { ApiGameStateController } from './controllers/state.controller';
import { WatchScoreChallengeService } from './watchers/watch.challenge.score.service';
import { WatchInviteChallengeService } from './watchers/watch.challenge.invites.service';
import { WatchService } from './watchers/watch.service';
import { ApiBoosterCron } from './crons/booster.cron';
import { ApiGameChallengeController } from './controllers/challange.controller';
import { InviteModule } from 'src/core/modules/invites/invite.module';
import { ApiGameChallangeService } from './services/challange.service';
import { InvoiceModule } from 'src/core/modules/invoice/invoice.module';
import { BotModule } from 'src/core/modules/bot/bot.module';
@Module({
  imports: [
    BoosterModule,
    GameModule,
    ChallengeModule,
    InviteModule,
    InvoiceModule,
    BotModule,
  ],
  controllers: [
    ApiGameBoosterController,
    ApiGameStateController,
    ApiGameChallengeController,
  ],
  providers: [
    ApiGameBoosterService,
    ApiGameStateService,
    ApiBoosterCron,
    WatchScoreChallengeService,
    WatchInviteChallengeService,
    WatchService,
    ApiGameChallangeService,
  ],
})
export class ApiGameModule {}
