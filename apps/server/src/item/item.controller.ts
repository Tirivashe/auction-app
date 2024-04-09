import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

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

  @Patch('item/:id')
  @HttpCode(HttpStatus.OK)
  async updateItem(
    @Body() updateItemDto: UpdateItemDto,
    @Param('id') id: string,
  ) {
    return await this.itemService.updateItem(updateItemDto, id);
  }

  @Delete('item/:id')
  @HttpCode(HttpStatus.OK)
  async deleteItem(@Param('id') id: string) {
    return await this.itemService.deleteItem(id);
  }
}
