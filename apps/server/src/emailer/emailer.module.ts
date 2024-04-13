import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BiddingHistory,
  BiddingHistorySchema,
} from 'src/bid/schema/bid-history.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: BiddingHistory.name, schema: BiddingHistorySchema },
    ]),
  ],
  providers: [EmailerService],
})
export class EmailerModule {}
