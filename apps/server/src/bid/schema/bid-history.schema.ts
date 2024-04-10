import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Item } from 'src/item/schema/item.schema';
import { User } from 'src/user/schema/user.schema';
import { Bid } from './bid.schema';
import { Status } from 'src/types';

export type BiddingHistoryDocument = HydratedDocument<BiddingHistory>;

@Schema()
export class BiddingHistory extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true })
  item: Item;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true },
    ],
  })
  bids: Bid[];

  @Prop({
    enum: ['won', 'lost', 'in_progress'],
    required: true,
    default: Status.InProgress,
  })
  bidStatus: Status;

  @Prop({ default: false, required: false })
  autobid?: boolean;
}

export const BiddingHistorySchema =
  SchemaFactory.createForClass(BiddingHistory);
