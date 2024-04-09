import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Bid } from './schema/bid.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BidService {
  constructor(@InjectModel(Bid.name) private bidModel: Model<Bid>) {}

  async getAllBids() {
    return await this.bidModel.find();
  }
}
