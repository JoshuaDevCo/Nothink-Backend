import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Booster } from '../../booster/entities/booster';

@Schema()
export class User {
  @Prop()
  telegram_id: string;
  @Prop()
  game_id: string;
  @Prop([{ type: Types.ObjectId, ref: 'Booster' }])
  boosters: Booster[];
}

export type UserDocument = HydratedDocument<User>;
export const userSchema = SchemaFactory.createForClass(User);
