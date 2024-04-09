import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Item } from 'src/item/schema/item.schema';
import { User } from 'src/user/schema/user.schema';
import { Bid } from './bid.schema';

export type BiddingHistoryDocument = HydratedDocument<BiddingHistory>;

enum Status {
  Won = 'won',
  Lost = 'lost',
  InProgress = 'in_progress',
}
@Schema()
export class BiddingHistory extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true })
  item: Item;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true })
  bid: Bid;

  @Prop({
    enum: ['won', 'lost', 'in_progress'],
    required: true,
    default: Status.InProgress,
  })
  bidStatus: Status;
}

export const BiddingHistorySchema =
  SchemaFactory.createForClass(BiddingHistory);
