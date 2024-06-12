import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Booster {
  @Prop({ enum: ['daily', 'paid'] })
  type: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  usages: Record<string, number>;

  @Prop({ default: -1 })
  max_usages: number;

  @Prop({
    enum: [
      'zen-power',
      'lotus-energy',
      'multitap',
      'energy-limit-increase',
      'energy-recharge-decrease',
      'autotapper',
    ],
  })
  key: string;

  @Prop({ default: 0 })
  level: number;

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
