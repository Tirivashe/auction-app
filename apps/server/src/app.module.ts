import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemModule } from './item/item.module';
import { BidModule } from './bid/bid.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailerModule } from './emailer/emailer.module';
import { ConfigModule } from '@nestjs/config';
import { BillingModule } from './billing/billing.module';
import { BiddingModule } from './bidding/bidding.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://tdummy999:VrOUL32BpHlJrFke@auctioncluster.s6n2al6.mongodb.net/?retryWrites=true&w=majority&appName=AuctionCluster',
    ),
    UserModule,
    AuthModule,
    ItemModule,
    BidModule,
    SchedulerModule,
    EmailerModule,
    BillingModule,
    BiddingModule,
  ],
})
export class AppModule {}
