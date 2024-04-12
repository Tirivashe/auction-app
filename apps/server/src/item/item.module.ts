import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schema/item.schema';
import { Bid, BidSchema } from 'src/bid/schema/bid.schema';
import {
  BiddingHistory,
  BiddingHistorySchema,
} from 'src/bid/schema/bid-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Bid.name, schema: BidSchema },
      { name: BiddingHistory.name, schema: BiddingHistorySchema },
    ]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
