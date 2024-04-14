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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryParamsDto } from './dto/query-params.dto';
// import { PlaceBidDto } from './dto/place-bid.dto';
import { RolesGuard } from './guards/roles.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/types';
import { Roles } from './decorators/roles.decorator';

@Controller()
@UseGuards(RolesGuard)
@UseGuards(JwtGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('items')
  async getAllItems(@Query() queryParams: QueryParamsDto) {
    return await this.itemService.getAllItems(queryParams);
  }

  @Get('items/:id')
  async getItemById(@Param('id') id: string) {
    return await this.itemService.getItemById(id);
  }

  @Post('item')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  async createItem(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.createItem(createItemDto);
  }

  // @Post('item/:id/bid')
  // @HttpCode(HttpStatus.CREATED)
  // async placeBid(@Body() placeBid: PlaceBidDto, @Param('id') itemId: string) {
  //   return await this.itemService.placeBid(itemId, placeBid);
  // }

  @Patch('item/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async updateItem(
    @Body() updateItemDto: UpdateItemDto,
    @Param('id') id: string,
  ) {
    return await this.itemService.updateItem(updateItemDto, id);
  }

  @Delete('item/:id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  async deleteItem(@Param('id') id: string) {
    return await this.itemService.deleteItem(id);
  }
}
