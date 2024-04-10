import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ToggleAutobidDto } from 'src/item/dto/toggle-autobid.dto';
import { UserSettingsDto } from './dto/user-settings.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Get('/:id/settings')
  async findUserSettingsById(@Param('id') id: string) {
    return this.userService.findUserSettingsById(id);
  }

  @Get('/:id/history')
  async getBiddingHistory(@Param('id') userId: string) {
    return this.userService.getBiddingHistory(userId);
  }

  @Patch('/toggle-autobid')
  async toggleAutobid(@Body() toggleAutobidDto: ToggleAutobidDto) {
    return this.userService.toggleAutobid(toggleAutobidDto);
  }

  @Patch(':id/settings')
  async setUserSettings(
    @Param('id') userId: string,
    @Body() userSettingsDto: UserSettingsDto,
  ) {
    return this.userService.setUserSettings(userId, userSettingsDto);
  }
}
