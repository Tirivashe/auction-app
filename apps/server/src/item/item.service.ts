import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Item } from './schema/item.schema';
import { Connection, Model } from 'mongoose';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { Bid } from 'src/bid/schema/bid.schema';
import { BiddingHistory } from 'src/bid/schema/bid-history.schema';
import { Status } from 'src/types';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Bid.name) private readonly bidModel: Model<Bid>,
    @InjectModel(BiddingHistory.name)
    private readonly biddingHistoryModel: Model<BiddingHistory>,
    @InjectConnection() private connection: Connection,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async getAllItems(queryParams: QueryParamsDto): Promise<Item[]> {
    const {
      description = '',
      name = '',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = queryParams;
    const skip = limit * (page - 1);
    const items = await this.itemModel
      .find({
        name: { $regex: name, $options: 'i' },
        description: { $regex: description, $options: 'i' },
      })
      .sort({ price: order === 'ASC' ? 'asc' : 'desc' })
      .limit(limit)
      .skip(skip);
    return items;
  }

  async createItem(createItemDto: CreateItemDto) {
    const { expiresAt, ...rest } = createItemDto;
    const date = new Date(expiresAt);
    await this.itemModel.create({ expiresAt: date, ...rest });
    return { message: 'Item created', status: HttpStatus.CREATED };
  }

  async placeBid(itemId: string, placeBidDto: PlaceBidDto) {
    const allBidsForItem = await this.bidModel.find({ item: itemId });
    const { canBid, message } = await this.canPlaceBid(
      itemId,
      allBidsForItem,
      placeBidDto,
    );
    if (!canBid) throw new BadRequestException(message);
    await this.createBid(itemId, placeBidDto);
    this.eventEmitter.emit('bid.created', {
      itemId,
      ...placeBidDto,
    });
    return { message: 'Bid created', status: HttpStatus.CREATED };
  }

  async updateItem(updateItemDto: UpdateItemDto, id: string) {
    const updatedItem = await this.itemModel.updateOne(
      { _id: id },
      updateItemDto,
    );
    return updatedItem;
  }
  async deleteItem(id: string) {
    await this.itemModel.deleteOne({ _id: id });
    return { message: 'Item Deleted', status: HttpStatus.OK };
  }

  private async canPlaceBid(
    itemId: string,
    allBidsForItem: Bid[],
    placeBidDto: PlaceBidDto,
  ) {
    if (allBidsForItem.length > 0) {
      const highestBid = await this.getHighestBidForItem(itemId);
      if (highestBid.user._id.toString() === placeBidDto.userId) {
        return {
          canBid: false,
          message: 'You are currently the highest bidder on this item',
        };
      }
      if (highestBid.bidAmount >= placeBidDto.amount) {
        return {
          canBid: false,
          message: 'Place a bid higher than the current highest bid amount',
        };
      }
    }
    const itemToBidOn: Item = await this.itemModel.findById(itemId);
    if (itemToBidOn.price >= placeBidDto.amount)
      return {
        canBid: false,
        message: 'Place a bid higher than the current price',
      };
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
    )[0];
  }

  // TODO: Lower the lines of code down to 30
  private async createBid(itemId: string, placeBidDto: PlaceBidDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const existingBiddingHistory = await this.biddingHistoryModel.findOne({
        item: itemId,
        user: placeBidDto.userId,
      });
      const newBid: Bid = new this.bidModel({
        user: placeBidDto.userId,
        item: itemId,
        bidAmount: placeBidDto.amount,
      });
      if (!existingBiddingHistory) {
        const newBiddingHistory: BiddingHistory = new this.biddingHistoryModel({
          bid: newBid._id,
          user: placeBidDto.userId,
          item: itemId,
          bidStatus: Status.InProgress,
          autobid: placeBidDto.autobid || false,
        });
        newBiddingHistory.bids.push(newBid);
        await newBiddingHistory.save({ session });
      } else {
        existingBiddingHistory.bids.push(newBid);
        await existingBiddingHistory.save({ session });
      }
      await newBid.save({ session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
