import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BillingEvents } from './events/billing.events';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bill } from './schema/bill.schema';
import { BiddingHistory } from 'src/bid/schema/bid-history.schema';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Bill.name) private readonly billingModel: Model<Bill>,
  ) {}

  @OnEvent(BillingEvents.CREATE, { async: true })
  async generateBill(biddingHistory: BiddingHistory) {
    await this.billingModel.create({
      user: biddingHistory.user,
      item: biddingHistory.item,
      amountDue: biddingHistory.item.awardedFor,
    });

    console.log('Bill created');
  }

  async getBills(): Promise<Bill[]> {
    return await this.billingModel.find().populate(['user', 'item']);
  }

  async getBillById(userId: string): Promise<Bill> {
    return await this.billingModel
      .findOne({ user: userId })
      .populate(['user', 'item']);
  }
}
