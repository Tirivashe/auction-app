import { Controller, Get, Param } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  async getBills() {
    return await this.billingService.getBills();
  }

  @Get(':id')
  async getBillById(@Param('id') userId: string) {
    return await this.billingService.getBillById(userId);
  }
}
