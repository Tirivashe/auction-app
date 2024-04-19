import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBiddingDto } from './dto/create-bidding.dto';
// import { UpdateBiddingDto } from './dto/update-bidding.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Bid } from 'src/bid/schema/bid.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { BidEvents } from 'src/bid/events/bid-events';
import { Status } from 'src/types';
import { BiddingHistory } from 'src/bid/schema/bid-history.schema';
import { Item } from 'src/item/schema/item.schema';
import { Server } from 'socket.io';
import { UserSettings } from 'src/user/schema/user-settings.schema';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class BiddingService {
  @WebSocketServer()
  server: Server;
  constructor(
    @InjectModel(Bid.name) private readonly bidModel: Model<Bid>,
    @InjectModel(BiddingHistory.name)
    private readonly biddingHistoryModel: Model<BiddingHistory>,
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
    @InjectModel(UserSettings.name)
    private readonly userSettingsModel: Model<UserSettings>,
    @InjectConnection() private readonly connection: Connection,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // TODO: Make this run concurrently correctly
  async onCreateBid(createBiddingDto: CreateBiddingDto, server: Server) {
    const allBidsForItem = await this.bidModel.find({
      item: createBiddingDto.itemId,
    });
    const { canBid, message } = await this.canPlaceBid(
      createBiddingDto,
      allBidsForItem,
    );
    if (!canBid) throw new BadRequestException(message);
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.createBid(createBiddingDto, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
    this.eventEmitter.emit(BidEvents.CREATED, createBiddingDto);
    server.emit('bid.created');
    return { message: 'Bid created', status: HttpStatus.CREATED };
  }

  @OnEvent(BidEvents.CREATED, { async: true })
  async onBidCreated(createBiddingDto: CreateBiddingDto) {
    const nextBidAmount = createBiddingDto.amount + 1;
    const userList = await this.usersWithAutobidEnabled(createBiddingDto);
    for (const user of userList) {
      const settings = await this.userSettingsModel.findOne({
        user: user.user,
      });
      const percentageOfMax =
        (settings?.totalAmountReserved / settings?.maxBidAmount) * 100;
      if (percentageOfMax >= settings?.autoBidPercentage) {
        this.eventEmitter.emit(BidEvents.AUTO_BID_REACHED, user._id, {
          once: true,
        });
      }
      if (
        settings?.totalAmountReserved + nextBidAmount >=
        settings?.maxBidAmount
      ) {
        this.eventEmitter.emit(BidEvents.AUTO_BID_EXCEEDED, user.user._id);
        continue;
      }
      await this.onCreateBid(
        {
          userId: user.user._id.toString(),
          itemId: createBiddingDto.itemId,
          amount: nextBidAmount,
        },
        this.server,
      );
      const session = await this.connection.startSession();
      session.startTransaction();
      try {
        settings.totalAmountReserved += nextBidAmount;
        await settings.save({ session });
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
      } finally {
        session.endSession();
      }
      this.eventEmitter.emit(BidEvents.CREATED, createBiddingDto);
      this.server.emit('bid.created');
    }
  }

  async createBid(createBiddingDto: CreateBiddingDto, session: ClientSession) {
    const existingBiddingHistory = await this.biddingHistoryModel.findOne({
      item: createBiddingDto.itemId,
      user: createBiddingDto.userId,
    });
    const newBid: Bid = new this.bidModel({
      $session: session,
      item: createBiddingDto.itemId,
      bidAmount: createBiddingDto.amount,
      user: createBiddingDto.userId,
    });
    if (!existingBiddingHistory) {
      const newBiddingHistory: BiddingHistory = new this.biddingHistoryModel({
        bid: newBid._id,
        user: createBiddingDto.userId,
        item: createBiddingDto.itemId,
        bidStatus: Status.InProgress,
        autobid: createBiddingDto.autobid || false,
      });
      newBiddingHistory.bids.push(newBid);
      await newBiddingHistory.save({ session });
    } else {
      existingBiddingHistory.bids.push(newBid);
      await existingBiddingHistory.save({ session });
    }
    await newBid.save({ session });
  }

  private async canPlaceBid(
    createBiddingDto: CreateBiddingDto,
    allBidsForItem: Bid[],
  ) {
    if (allBidsForItem.length > 0) {
      const highestBid = await this.getHighestBidForItem(
        createBiddingDto.itemId,
      );
      if (highestBid.user.id.toString() === createBiddingDto.userId) {
        return {
          canBid: false,
          message: 'You are currently the highest bidder on this item',
        };
      }
      if (highestBid.bidAmount >= createBiddingDto.amount) {
        return {
          canBid: false,
          message: 'Place a bid higher than the current highest bid amount',
        };
      }
    }
    const itemToBidOn: Item = await this.itemModel.findById(
      createBiddingDto.itemId,
    );
    if (itemToBidOn.price >= createBiddingDto.amount)
      return {
        canBid: false,
        message: 'Place a bid higher than the current price',
      };
    if (!itemToBidOn.isActive)
      return { canBid: false, message: 'Bidding for this item has closed' };
    return { canBid: true, message: '' };
  }

  private async getHighestBidForItem(itemId: string): Promise<Bid> {
    return (
      await this.bidModel
        .find({ item: itemId })
        .sort({
          bidAmount: -1,
        })
        .limit(1)
        .populate('user')
    )[0];
  }

  private async usersWithAutobidEnabled(createBiddingDto: CreateBiddingDto) {
    const usersWithAutobidEnabled: BiddingHistory[] =
      await this.biddingHistoryModel.find({
        item: createBiddingDto.itemId,
        autobid: true,
        user: { $ne: createBiddingDto.userId },
      });

    return usersWithAutobidEnabled;
  }
}
