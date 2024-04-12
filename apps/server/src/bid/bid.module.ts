import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schema/bid.schema';
import {
  BiddingHistory,
  BiddingHistorySchema,
} from './schema/bid-history.schema';
import {
  UserSettings,
  UserSettingsSchema,
} from 'src/user/schema/user-settings.schema';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [
    ItemModule,
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: BiddingHistory.name, schema: BiddingHistorySchema },
      { name: UserSettings.name, schema: UserSettingsSchema },
    ]),
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
