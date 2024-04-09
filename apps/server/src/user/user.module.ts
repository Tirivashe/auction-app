import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import {
  UserSettings,
  UserSettingsSchema,
} from './schema/user-settings.schema';
import {
  BiddingHistory,
  BiddingHistorySchema,
} from 'src/bid/schema/bid-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSettings.name, schema: UserSettingsSchema },
      { name: BiddingHistory.name, schema: BiddingHistorySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
