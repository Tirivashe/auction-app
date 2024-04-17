import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Item } from './schema/item.schema';
import { Connection, Model } from 'mongoose';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { Bid } from 'src/bid/schema/bid.schema';
import { BiddingHistory } from 'src/bid/schema/bid-history.schema';
import { Status } from 'src/types';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ItemEvents } from './events/item-events';
import { BidEvents } from 'src/bid/events/bid-events';

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
  async getAllItems(queryParams: QueryParamsDto) {
    const { filter = '', order = 'DESC', page = 1, limit = 10 } = queryParams;
    const filterParams = {
      $or: [
        { name: { $regex: filter, $options: 'i' } },
        { description: { $regex: filter, $options: 'i' } },
      ],
    };
    const skip = limit * (page - 1);
    const items: Item[] = await this.itemModel
      .find({ ...filterParams })
      .sort({ price: order === 'ASC' ? 'asc' : 'desc' })
      .limit(limit)
      .skip(skip)
      .populate('winner');
    const total = await this.itemModel.countDocuments({ ...filterParams });
    const hasNext = total > skip + items.length;
    const hasPrevious = skip > 0;
    const totalPages = Math.ceil(total / limit);
    return { items, hasNext, hasPrevious, totalPages };
  }

  async getItemById(itemId: string): Promise<Item> {
    return await this.itemModel.findOne({ _id: itemId }).populate('winner');
  }

  async createItem(createItemDto: CreateItemDto) {
    const { expiresAt, ...rest } = createItemDto;
    const date = new Date(expiresAt);
    const createdItem: Item = await this.itemModel.create({
      expiresAt: date,
      ...rest,
    });
    this.eventEmitter.emit(ItemEvents.CREATED, createdItem);
    return { message: 'Item created', statusCode: HttpStatus.CREATED };
  }

  async updateItem(updateItemDto: UpdateItemDto, id: string) {
    await this.itemModel.updateOne({ _id: id }, updateItemDto);
    this.eventEmitter.emit(ItemEvents.UPDATED, { id, updateItemDto });
    return { message: 'Item edited', statusCode: HttpStatus.CREATED };
  }
  async deleteItem(id: string) {
    await this.itemModel.deleteOne({ _id: id });
    this.eventEmitter.emit(ItemEvents.DELETED, id);
    return { message: 'Item Deleted', statusCode: HttpStatus.OK };
  }

  @OnEvent(BidEvents.CLOSED)
  async awardItemToHighestBidder(itemId: string) {
    const highestBid = await this.getHighestBidForItem(itemId);
    const item = await this.itemModel.findById(itemId);
    if (!item) return;
    if (highestBid) {
      const usersBiddingOnItem = await this.getUsersBiddingOnItem(
        highestBid.item._id.toString(),
      );
      for (const user of usersBiddingOnItem) {
        if (user.user._id.toString() === highestBid.user._id.toString()) {
          user.bidStatus = Status.Won;
        } else {
          user.bidStatus = Status.Lost;
        }
        user.autobid = false;
        await user.save();
      }
    }
    item.winner = highestBid.user._id || null;
    item.awardedFor = highestBid.bidAmount || 0;
    item.isActive = false;
    await item.save();
    console.log('Item awarded!!!');
    this.eventEmitter.emit(ItemEvents.ITEM_AWARDED, highestBid);
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

  private async getUsersBiddingOnItem(
    itemId: string,
  ): Promise<BiddingHistory[]> {
    return await this.biddingHistoryModel
      .find({
        item: itemId,
      })
      .populate('user');
  }
}
