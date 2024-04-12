import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Bid } from './schema/bid.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { BidPlacedEvent } from 'src/events/bid-placed.event';
import { BiddingHistory } from './schema/bid-history.schema';
import { UserSettings } from 'src/user/schema/user-settings.schema';

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
  ) {}

  async getAllBids() {
    return await this.bidModel.find().populate('user').populate('item');
  }

  // TODO: Make this run concurrently correctly and reduce complexity
  @OnEvent('bid.created', { async: true })
  async autobidForUser(payload: BidPlacedEvent) {
    const nextBidAmount = payload.amount + 1;
    const userList = await this.usersWithAutobidEnabled(payload);
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      for (const user of userList) {
        const settings: UserSettings = await this.userSettingsModel.findOne({
          user: user.user,
        });
        if (
          settings.maxBidAmount &&
          settings.maxBidAmount > 0 &&
          settings.totalAmountReserved + nextBidAmount > settings.maxBidAmount
        )
          continue;

        const newBid: Bid = new this.bidModel({
          user: user.user,
          item: payload.itemId,
          bidAmount: nextBidAmount,
        });
        const userSettings = await this.userSettingsModel.findOneAndUpdate(
          { user: user.user },
          { $inc: { totalAmountReserved: nextBidAmount } },
          { new: true, session },
        );

        user.bids.push(newBid);
        await userSettings.save({ session });
        await user.save({ session });
        await newBid.save({ session });
      }
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
    this.eventEmitter.emitAsync('autobid.created', { nextBidAmount, payload });
  }

  @OnEvent('autobid.created', { async: true })
  async onAutobidCreated({
    nextBidAmount,
    payload,
  }: {
    nextBidAmount: number;
    payload: BidPlacedEvent;
  }) {
    const userList = await this.usersWithAutobidEnabled(payload);
    for (const user of userList) {
      const settings = await this.userSettingsModel.findOne({
        user: user.user,
      });
      if (
        !settings?.maxBidAmount ||
        !settings?.autoBidPercentage ||
        !settings?.totalAmountReserved
      )
        continue;
      const percentageOfMax =
        (settings?.totalAmountReserved / settings?.maxBidAmount) * 100;

      if (percentageOfMax >= settings?.autoBidPercentage) {
        this.eventEmitter.emit('autobid.reached', user._id, {
          once: true,
        });
      }
      if (
        settings?.totalAmountReserved + nextBidAmount >=
        settings?.maxBidAmount
      ) {
        this.eventEmitter.emit('autobid.exceeded', user._id);
      }
    }
  }

  private async usersWithAutobidEnabled(payload: BidPlacedEvent) {
    const usersWithAutobidEnabled: BiddingHistory[] =
      await this.biddingHistoryModel.find({
        item: payload.itemId,
        autobid: true,
        user: { $ne: payload.userId },
      });

    return usersWithAutobidEnabled;
  }
}
