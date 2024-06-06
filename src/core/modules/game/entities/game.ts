import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Game {
  @Prop()
  score: number;
  @Prop()
  tap_value: number;
  @Prop()
  multiplier: number;

  @Prop()
  energy: number;
  @Prop()
  max_energy: number;
  @Prop({ default: 0 })
  energy_recharge_time_reduce: number;

  @Prop({ default: Date.now })
  created_at: Date;
  @Prop({ default: Date.now })
  updated_at: Date;
}

export type GameDocument = HydratedDocument<Game>;
export const gameSchema = SchemaFactory.createForClass(Game);
