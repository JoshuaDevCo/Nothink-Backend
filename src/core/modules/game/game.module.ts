import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, gameSchema } from './entities/game';
import { GameSnapshot, gameSnapshotSchema } from './entities/game.snapshot';
import { GameService } from './game.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Game.name,
        useFactory: () => {
          const mySchema = gameSchema;
          mySchema.pre('save', function (next) {
            console.log('saving');
            this.updated_at = new Date();
            next();
          });
          return mySchema;
        },
      },
      {
        name: GameSnapshot.name,
        useFactory: () => {
          const mySchema = gameSnapshotSchema;
          mySchema.pre('save', function (next) {
            // if (doc.password) ;
            this.updated_at = new Date();
            next();
          });
          return mySchema;
        },
      },
    ]),
  ],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
