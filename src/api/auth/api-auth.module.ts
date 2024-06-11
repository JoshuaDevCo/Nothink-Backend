import { Module } from '@nestjs/common';
import { AuthModule } from 'src/core/modules/auth/auth.module';
import { ApiAuthService } from './services/api-auth.service';
import { ApiAuthController } from './controllers/api-auth.controller';

@Module({
  imports: [AuthModule],
  providers: [ApiAuthService],
  controllers: [ApiAuthController],
})
export class ApiAuthModule {}
