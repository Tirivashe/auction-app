import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ItemModule } from './item/item.module';
import { BidModule } from './bid/bid.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

// TODO: Change the mongo connection string to mongo atlas later
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb://127.0.0.1:27017/tiri?directConnection=true',
    ),
    UserModule,
    AuthModule,
    ItemModule,
    BidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
