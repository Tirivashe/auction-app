import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Item } from 'src/item/schema/item.schema';
import { User } from 'src/user/schema/user.schema';

export type BillDocument = HydratedDocument<Bill>;

@Schema({ timestamps: true })
export class Bill extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
  item: Item;

  @Prop()
  amountDue: number;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
