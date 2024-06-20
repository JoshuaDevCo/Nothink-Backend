import { AuthModule } from './auth/auth.module';
import { UserModule } from './auth/modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BotModule } from './bot/bot.module';
import { InvoiceModule } from './invoice/invoice.module';

export const CoreModules = [
  ScheduleModule.forRoot(),
  UserModule,
  AuthModule,
  BotModule,
  InvoiceModule,
];
