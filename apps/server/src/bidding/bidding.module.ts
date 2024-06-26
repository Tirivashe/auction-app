import { Module } from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { BiddingGateway } from './bidding.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from 'src/item/schema/item.schema';
import { Bid, BidSchema } from 'src/bid/schema/bid.schema';
import {
  BiddingHistory,
  BiddingHistorySchema,
} from 'src/bid/schema/bid-history.schema';
import {
  UserSettings,
  UserSettingsSchema,
} from 'src/user/schema/user-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Bid.name, schema: BidSchema },
      { name: BiddingHistory.name, schema: BiddingHistorySchema },
      { name: UserSettings.name, schema: UserSettingsSchema },
    ]),
  ],
  providers: [BiddingGateway, BiddingService],
})
export class BiddingModule {}
