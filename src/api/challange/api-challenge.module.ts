import { Module } from '@nestjs/common';
import { ChallengeModule } from 'src/core/modules/challange/challenge.module';
import { ApiChallengeController } from './controllers/api-challenge.controller';

@Module({
  imports: [ChallengeModule],
  controllers: [ApiChallengeController],
})
export class ApiChallengeModule {}
