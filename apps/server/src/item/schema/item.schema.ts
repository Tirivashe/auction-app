import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ max: 255 })
  description: string;

  @Prop()
  image?: string;

  @Prop({ type: 'number', required: true })
  price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
