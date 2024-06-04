import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, gameSchema } from './entities/game';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: gameSchema }]),
  ],
})
export class GameModule {}
