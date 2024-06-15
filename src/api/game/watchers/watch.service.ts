import { Injectable, OnModuleInit } from '@nestjs/common';
import { WatchScoreChallengeService } from './watch.challenge.score.service';
import { WatchInviteChallengeService } from './watch.challenge.invites.service';
import { IChallange } from '../types/challange.types';
import { CHALLENGES } from '../constants/challenges';
import { ChallengeService } from 'src/core/modules/challange/challenge.service';

@Injectable()
export class WatchService implements OnModuleInit {
  CHALLENGES: IChallange[];
  constructor(
    private readonly watchScoreService: WatchScoreChallengeService,
    private readonly watchInvitesService: WatchInviteChallengeService,
    private readonly service: ChallengeService,
  ) {
    this.CHALLENGES = [...CHALLENGES.score, ...CHALLENGES.invite];
    console.log(this.CHALLENGES);
  }

  async getCompleted(userId: string) {
    return this.service.getCompletedChallanges(userId);
  }

  onModuleInit() {
    this.watchInvitesService.watch();
    this.watchScoreService.watch();
  }
}
