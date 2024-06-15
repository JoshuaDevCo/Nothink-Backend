import { Module } from '@nestjs/common';
import { ApiAuthService } from './services/api-auth.service';
import { ApiAuthController } from './controllers/api-auth.controller';
import { InviteModule } from 'src/core/modules/invites/invite.module';

@Module({
  imports: [InviteModule],
  providers: [ApiAuthService],
  controllers: [ApiAuthController],
})
export class ApiAuthModule {}
