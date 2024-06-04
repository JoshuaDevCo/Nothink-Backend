import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Booster {
  @Prop()
  type: string;
  @Prop({ default: 0 })
  level: string;

  @Prop()
  label: string;
  @Prop()
  desciption: string;
  @Prop()
  price: number;
  @Prop()
  denom: string;
}

export type BoosterDocument = HydratedDocument<Booster>;
export const boosterSchema = SchemaFactory.createForClass(Booster);
