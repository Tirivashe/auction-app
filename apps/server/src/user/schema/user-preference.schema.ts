import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type UserSettingsDocument = HydratedDocument<UserSettings>;

@Schema()
export class UserSettings {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: User;

  @Prop()
  isAutoBidEnabled: boolean;

  @Prop({ required: false, type: 'number' })
  autoBidAmount: number;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
