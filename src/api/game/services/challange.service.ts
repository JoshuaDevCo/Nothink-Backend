import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChallengeService } from 'src/core/modules/challange/challenge.service';
import { CHALLENGES } from '../constants/challenges';
import { GameService } from 'src/core/modules/game/game.service';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';

@Injectable()
export class ApiGameChallangeService {
  private logger = new Logger(ApiGameChallangeService.name);
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly userService: UserService,
    private readonly gamerService: GameService,
  ) {}

  async claimReward(userId: string, challengeId: string) {
    try {
      this.logger.debug(userId, challengeId);
      const [claimed, challange] = await this.challengeService.claim(
        userId,
        challengeId,
      );
      if (!claimed) throw new ForbiddenException('Cannot claim a reward');
      console.log(challange);
      const challangeReward = [...CHALLENGES.invite, ...CHALLENGES.score].find(
        (item) => item.type === challange.type,
      );
      if (!challangeReward)
        throw new NotImplementedException('Unable to find your reward');
      const user = await this.userService.findUserById(userId);
      if (!user) throw new UnauthorizedException('User not found');
      await this.gamerService.addScore(
        user.game_id,
        Number(challangeReward.reward),
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
