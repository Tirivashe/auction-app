import { Controller, Get } from '@nestjs/common';
import { BidService } from './bid.service';

@Controller()
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get('bids')
  async getAllBids() {
    return await this.bidService.getAllBids();
  }
}
