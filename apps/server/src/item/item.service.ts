import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schema/item.schema';
import { Model } from 'mongoose';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}
  async getAllItems() {
    return await this.itemModel.find();
  }

  async createItem(createItemDto: CreateItemDto) {
    await this.itemModel.create(createItemDto);
    return { message: 'Item created', status: HttpStatus.CREATED };
  }
}
