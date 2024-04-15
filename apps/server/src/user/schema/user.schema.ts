import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { UserSettings } from './user-settings.schema';
import { Role } from 'src/types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['ADMIN', 'REGULAR'], required: true, default: Role.Regular })
  role: Role;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSettings',
  })
  userSettings: UserSettings;
}

export const UserSchema = SchemaFactory.createForClass(User);
