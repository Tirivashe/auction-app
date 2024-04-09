import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type UserSettingsDocument = HydratedDocument<UserSettings>;

@Schema()
export class UserSettings {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  })
  user: User;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.Number,
    min: 0,
    default: null,
  })
  autoBidAmount?: number;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.Number,
    max: 100,
    min: 0,
    default: 0,
  })
  autoBidPercentage?: number;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
