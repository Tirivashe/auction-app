import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Bid } from './schema/bid.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BiddingHistory } from './schema/bid-history.schema';
import { UserSettings } from 'src/user/schema/user-settings.schema';
// import { BidEvents } from './events/bid-events';
import { ItemService } from 'src/item/item.service';
import { PlaceBidDto } from 'src/item/dto/place-bid.dto';

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

  // TODO: Make this run concurrently correctly and reduce complexity
  // @OnEvent(BidEvents.CREATED, { async: true })
  // async autobidForUser({
  //   itemId,
  //   placeBidDto,
  // }: {
  //   itemId: string;
  //   placeBidDto: PlaceBidDto;
  // }) {
  //   const nextBidAmount = placeBidDto.amount + 1;
  //   const userList = await this.usersWithAutobidEnabled({
  //     itemId,
  //     placeBidDto,
  //   });
  //   const session = await this.connection.startSession();
  //   session.startTransaction();
  //   try {
  //     for (const user of userList) {
  //       const settings: UserSettings = await this.userSettingsModel.findOne({
  //         user: user.user,
  //       });
  //       if (
  //         settings.maxBidAmount &&
  //         settings.maxBidAmount > 0 &&
  //         settings.totalAmountReserved + nextBidAmount > settings.maxBidAmount
  //       )
  //         continue;

  //       await this.itemService.createBid(
  //         itemId,
  //         { userId: user._id.toString(), amount: nextBidAmount },
  //         session,
  //       );
  //       const userSettings = await this.userSettingsModel.findOneAndUpdate(
  //         { user: user.user },
  //         { $inc: { totalAmountReserved: nextBidAmount } },
  //         { new: true },
  //       );

  //       await userSettings.save({ session });

  //       this.eventEmitter.emit(BidEvents.CREATED, {
  //         itemId: itemId,
  //         userId: user._id.toString(),
  //         amount: nextBidAmount,
  //       });
  //     }
  //     await session.commitTransaction();
  //   } catch (err) {
  //     await session.abortTransaction();
  //   } finally {
  //     session.endSession();
  //   }
  //   this.eventEmitter.emit(BidEvents.AUTO_BID_CREATED, {
  //     itemId,
  //     nextBidAmount,
  //     placeBidDto,
  //   });
  // }

  // @OnEvent(BidEvents.AUTO_BID_CREATED, { async: true })
  // async onAutobidCreated({
  //   itemId,
  //   nextBidAmount,
  //   placeBidDto,
  // }: {
  //   itemId: string;
  //   nextBidAmount: number;
  //   placeBidDto: PlaceBidDto;
  // }) {
  //   const userList = await this.usersWithAutobidEnabled({
  //     itemId,
  //     placeBidDto,
  //   });
  //   for (const user of userList) {
  //     const settings = await this.userSettingsModel.findOne({
  //       user: user.user,
  //     });
  //     if (
  //       !settings?.maxBidAmount ||
  //       !settings?.autoBidPercentage ||
  //       !settings?.totalAmountReserved
  //     )
  //       continue;
  //     const percentageOfMax =
  //       (settings?.totalAmountReserved / settings?.maxBidAmount) * 100;

  //     if (percentageOfMax >= settings?.autoBidPercentage) {
  //       this.eventEmitter.emit(BidEvents.AUTO_BID_REACHED, user._id, {
  //         once: true,
  //       });
  //     }
  //     if (
  //       settings?.totalAmountReserved + nextBidAmount >=
  //       settings?.maxBidAmount
  //     ) {
  //       this.eventEmitter.emit(BidEvents.AUTO_BID_EXCEDDED, user._id);
  //     }
  //   }
  // }

  private async usersWithAutobidEnabled({
    itemId,
    placeBidDto,
  }: {
    itemId: string;
    placeBidDto: PlaceBidDto;
  }) {
    const usersWithAutobidEnabled: BiddingHistory[] =
      await this.biddingHistoryModel.find({
        item: itemId,
        autobid: true,
        user: { $ne: placeBidDto.userId },
      });

    return usersWithAutobidEnabled;
  }
}
