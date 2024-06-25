import { Injectable, Logger } from '@nestjs/common';
import { Invoice, InvoiceDocument } from './enrtities';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InvoiceService {
  private logger = new Logger(InvoiceService.name);
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<Invoice>,
  ) {}

  findInvoicesByTelegramId(telegram_id: number) {
    return this.invoiceModel.find({ telegram_id });
  }

  addInvoice(telegram_id: number, tx_id: string) {
    // TODO:
    // as i remember insertMany will throw error if collection empty or doesn't exsits
    try {
      return this.invoiceModel.insertMany({ telegram_id, tx_id });
    } catch (error) {
      this.logger.error(error);
      return;
    }
  }
}
