import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BidService } from './bid.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller()
@UseGuards(JwtGuard)
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
