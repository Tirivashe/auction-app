import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ max: 255, required: false })
  description?: string;

  @Prop({ required: false })
  image?: string;

  @Prop({ type: 'number', required: true })
  price: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
