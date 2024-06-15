import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, challengeSchema } from './enrtities';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Challenge.name,
        useFactory: () => {
          const mySchema = challengeSchema;
          mySchema.index({ user_id: 1, type: 1 }, { unique: true });
          return mySchema;
        },
      },
    ]),
  ],
  providers: [ChallengeService],
  exports: [ChallengeService],
})
export class ChallengeModule {}
