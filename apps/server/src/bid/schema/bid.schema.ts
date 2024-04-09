import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Item } from 'src/item/schema/item.schema';
import { User } from 'src/user/schema/user.schema';

export type BidDocument = HydratedDocument<Bid>;

@Schema({ timestamps: true })
export class Bid extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
  item: Item;

  @Prop()
  bidAmount: number;

  // @Prop({ default: Date.now, required: true })
  // bidTime: Date;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
