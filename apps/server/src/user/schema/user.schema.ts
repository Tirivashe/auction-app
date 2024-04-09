import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserSettings } from './user-settings.schema';

export type UserDocument = HydratedDocument<User>;

enum Role {
  Admin = 'Admin',
  Regular = 'Regular',
}
@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['Admin', 'Regular'], required: true, default: Role.Regular })
  role: Role;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSettings',
  })
  userSettings: UserSettings;
}

export const UserSchema = SchemaFactory.createForClass(User);
