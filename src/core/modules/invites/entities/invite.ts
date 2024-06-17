import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Invite {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  from: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  accepted_by: string[];

  @Prop({ default: 0 })
  claimed: number;
}

export type InviteDocument = HydratedDocument<Invite>;
export const inviteSchema = SchemaFactory.createForClass(Invite);
