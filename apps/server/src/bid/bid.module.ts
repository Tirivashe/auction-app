import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schema/bid.schema';
import {
  BiddingHistory,
  BiddingHistorySchema,
} from './schema/bid-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: BiddingHistory.name, schema: BiddingHistorySchema },
    ]),
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
