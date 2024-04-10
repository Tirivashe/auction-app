import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Bid } from './schema/bid.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { BidPlacedEvent } from 'src/events/bid-placed.event';
import { BiddingHistory } from './schema/bid-history.schema';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(BiddingHistory.name)
    private readonly biddingHistoryModel: Model<BiddingHistory>,
    @InjectConnection() private connection: Connection,
  ) {}

  async getAllBids() {
    return await this.bidModel.find();
  }

  // TODO: Make this run concurrently correctly
  @OnEvent('bid.created')
  async autobidForUser(payload: BidPlacedEvent) {
    const usersWithAutobidEnabled: BiddingHistory[] =
      await this.biddingHistoryModel.find({
        item: payload.itemId,
        autobid: true,
        user: { $ne: payload.userId },
      });
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      for (const user of usersWithAutobidEnabled) {
        const newBid: Bid = new this.bidModel({
          user: user.user,
          item: payload.itemId,
          bidAmount: payload.amount + 1,
        });
        user.bids.push(newBid);
        await user.save({ session });
        await newBid.save({ session });
      }
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
