import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemModule } from './item/item.module';
import { BidModule } from './bid/bid.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './notification/notification.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailerModule } from './emailer/emailer.module';
import { ConfigModule } from '@nestjs/config';
import { BillingModule } from './billing/billing.module';
import { BiddingModule } from './bidding/bidding.module';

// TODO: Change the mongo connection string to mongo atlas later
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb://127.0.0.1:27017/tiri?directConnection=true',
    ),
    UserModule,
    AuthModule,
    ItemModule,
    BidModule,
    NotificationModule,
    SchedulerModule,
    EmailerModule,
    BillingModule,
    BiddingModule,
  ],
})
export class AppModule {}
