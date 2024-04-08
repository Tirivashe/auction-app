import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('items')
  async getAllItems() {
    return await this.itemService.getAllItems();
  }

  @Post('item')
  @HttpCode(HttpStatus.CREATED)
  async createItem(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.createItem(createItemDto);
  }
}
