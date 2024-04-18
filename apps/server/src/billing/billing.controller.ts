import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('billing')
@UseGuards(JwtGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  async getBills() {
    return await this.billingService.getBills();
  }

  @Get(':id')
  async getBillById(@Param('id') itemId: string) {
    return await this.billingService.getBillById(itemId);
  }
}
