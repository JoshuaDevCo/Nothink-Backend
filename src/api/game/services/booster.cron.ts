import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/core/modules/auth/modules/user/user.service';

@Injectable()
export class ApiBoosterCron {
  constructor(private readonly userService: UserService) {}

  //   @Cron('*/5 * * * * *')
  //   exec() {}
}
