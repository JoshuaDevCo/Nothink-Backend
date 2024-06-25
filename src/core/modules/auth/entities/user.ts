import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Booster } from '../../booster/entities/booster';

@Schema()
export class User {
  @Prop()
  telegram_id: number;
  @Prop({ type: MongooseSchema.Types.Mixed })
  telegram_details: { username?: string };
  @Prop()
  game_id: string;
  @Prop()
  chat_id?: number;
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Booster' }])
  boosters: Booster[];
}

export type UserDocument = HydratedDocument<User>;
export const userSchema = SchemaFactory.createForClass(User);
