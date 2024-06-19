import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, invoiceSchema } from './enrtities';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Invoice.name,
        useFactory: () => {
          const mySchema = invoiceSchema;
          mySchema.index({ user_id: 1, tx_id: 1 }, { unique: true });
          return mySchema;
        },
      },
    ]),
  ],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
