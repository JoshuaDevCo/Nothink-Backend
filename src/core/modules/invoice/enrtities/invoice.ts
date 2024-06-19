import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../auth/entities/user';

@Schema()
export class Invoice {
  @Prop()
  telegram_id: string;

  @Prop()
  tx_id: string;
}

export type InvoiceDocument = HydratedDocument<Invoice>;
export const invoiceSchema = SchemaFactory.createForClass(Invoice);
