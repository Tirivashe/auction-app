import { Controller, Get, Post } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidPlacedEvent } from 'src/events/bid-placed.event';

@Controller()
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get('bids')
  async getAllBids() {
    return await this.bidService.getAllBids();
  }

  @Post('autobid')
  async autobidForUser(payload: BidPlacedEvent) {
    return await this.bidService.autobidForUser(payload);
  }
}
