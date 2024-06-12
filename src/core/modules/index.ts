import { AuthModule } from './auth/auth.module';
import { UserModule } from './auth/modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

export const CoreModules = [ScheduleModule.forRoot(), UserModule, AuthModule];
