import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Bid } from './schema/bid.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BiddingHistory } from './schema/bid-history.schema';
import { UserSettings } from 'src/user/schema/user-settings.schema';
import { ItemService } from 'src/item/item.service';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(BiddingHistory.name)
    private readonly biddingHistoryModel: Model<BiddingHistory>,
    @InjectConnection() private connection: Connection,
    @InjectModel(UserSettings.name)
    private readonly userSettingsModel: Model<UserSettings>,
    private readonly eventEmitter: EventEmitter2,
    private readonly itemService: ItemService,
  ) {}

  async getAllBids() {
    return await this.bidModel.find().populate('user').populate('item');
  }

  async getBidsByItemId(itemId: string): Promise<Bid[]> {
    return await this.bidModel
      .find({ item: itemId })
      .populate('item')
      .populate('user')
      .sort({ createdAt: 'desc' });
  }
}
