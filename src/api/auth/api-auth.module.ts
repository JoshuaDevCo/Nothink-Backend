import { Module } from '@nestjs/common';
import { ApiAuthService } from './services/api-auth.service';
import { ApiAuthController } from './controllers/api-auth.controller';

@Module({
  imports: [],
  providers: [ApiAuthService],
  controllers: [ApiAuthController],
})
export class ApiAuthModule {}
