import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booster, boosterSchema } from './entities/booster';
import { BoosterService } from './booster.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booster.name, schema: boosterSchema }]),
  ],
  providers: [BoosterService],
  exports: [BoosterService],
})
export class BoosterModule {}
