import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../auth/entities/user';

@Schema()
export class Challenge {
  @Prop()
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop({ default: false })
  claimed: boolean;
}

export type ChallengeDocument = HydratedDocument<Challenge>;
export const challengeSchema = SchemaFactory.createForClass(Challenge);
