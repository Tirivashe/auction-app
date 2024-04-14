import { Controller, Get, Param } from '@nestjs/common';
import { BidService } from './bid.service';

@Controller()
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get('bids')
  async getAllBids() {
    return await this.bidService.getAllBids();
  }

  @Get('bid/:id')
  async getBidsByItemId(@Param('id') id: string) {
    return await this.bidService.getBidsByItemId(id);
  }
}
