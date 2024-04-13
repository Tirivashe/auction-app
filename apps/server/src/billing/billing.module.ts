import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './schema/bill.schema';
import { BillingController } from './billing.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
  ],
  providers: [BillingService],
  controllers: [BillingController],
})
export class BillingModule {}
