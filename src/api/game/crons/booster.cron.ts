import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';
import { BoosterService } from 'src/core/modules/booster';

@Injectable()
export class ApiBoosterCron {
  private logger = new Logger(ApiBoosterCron.name);
  constructor(
    private readonly userService: UserService,
    private readonly boosterService: BoosterService,
  ) {}

  onModuleInit() {
    this.resetUsages();
  }
  //   @Cron('*/5 * * * * *')
  //   exec() {}

  @Cron('0 0 * * * *')
  async resetUsages() {
    this.logger.log('Staring reset cron job');
    const boosters = await this.boosterService.getDailyAll();

    for await (const booster of boosters) {
      await booster.updateOne({
        usages: {},
      });
    }
    this.logger.log('Reset cron job over');
  }
}
