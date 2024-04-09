import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from './schema/item.schema';
import { Model } from 'mongoose';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}
  async getAllItems(queryParams: QueryParamsDto): Promise<Item[]> {
    const {
      description = '',
      name = '',
      order = 'DESC',
      page = 1,
      limit = 10,
    } = queryParams;
    const skip = limit * (page - 1);
    const items = await this.itemModel
      .find({
        name: { $regex: name, $options: 'i' },
        description: { $regex: description, $options: 'i' },
      })
      .sort({ price: order === 'ASC' ? 'asc' : 'desc' })
      .limit(limit)
      .skip(skip);
    return items;
  }

  async createItem(createItemDto: CreateItemDto) {
    const { expiresAt, ...rest } = createItemDto;
    const date = new Date(expiresAt);
    await this.itemModel.create({ expiresAt: date, ...rest });
    return { message: 'Item created', status: HttpStatus.CREATED };
  }

  async updateItem(updateItemDto: UpdateItemDto, id: string) {
    const updatedItem = await this.itemModel.updateOne(
      { _id: id },
      updateItemDto,
    );
    return updatedItem;
  }
  async deleteItem(id: string) {
    await this.itemModel.deleteOne({ _id: id });
    return { message: 'Item Deleted', status: HttpStatus.OK };
  }
}
