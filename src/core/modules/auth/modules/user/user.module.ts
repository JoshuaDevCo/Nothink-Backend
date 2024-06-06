import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../../entities/user';
import { UserService } from './user.service';
import { Game, gameSchema } from 'src/core/modules/game/entities/game';
import { Booster, boosterSchema } from 'src/core/modules/booster';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Game.name, schema: gameSchema },
      { name: Booster.name, schema: boosterSchema },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
