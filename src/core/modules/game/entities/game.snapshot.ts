import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Game } from './game';
import { User } from '../../auth/entities/user';

@Schema()
export class GameSnapshot {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: User;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Game' })
  game_id: Game;
  @Prop({ type: MongooseSchema.Types.Mixed })
  game: Game;
  @Prop({ default: Date.now })
  updated_at: Date;
}

export type GameSnapshotDocument = HydratedDocument<GameSnapshot>;
export const gameSnapshotSchema = SchemaFactory.createForClass(GameSnapshot);
