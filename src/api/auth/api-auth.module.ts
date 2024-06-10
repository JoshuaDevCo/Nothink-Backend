import { Module } from '@nestjs/common';
import { AuthModule } from 'src/core/modules/auth/auth.module';
import { ApiAuthService } from './services/api-auth.service';
import { ApiAuthController } from './controllers/api-auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule],
  providers: [ApiAuthService, ConfigService],
  controllers: [ApiAuthController],
})
export class ApiAuthModule {}
