import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, challengeSchema } from './enrtities';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: challengeSchema },
    ]),
  ],
  providers: [ChallengeService],
  exports: [ChallengeService],
})
export class ChallengeModule {}
