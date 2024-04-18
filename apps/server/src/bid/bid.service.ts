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

  // private async usersWithAutobidEnabled({
  //   itemId,
  //   placeBidDto,
  // }: {
  //   itemId: string;
  //   placeBidDto: PlaceBidDto;
  // }) {
  //   const usersWithAutobidEnabled: BiddingHistory[] =
  //     await this.biddingHistoryModel.find({
  //       item: itemId,
  //       autobid: true,
  //       user: { $ne: placeBidDto.userId },
  //     });

  //   return usersWithAutobidEnabled;
  // }
}
