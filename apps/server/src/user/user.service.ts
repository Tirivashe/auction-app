import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserSettings } from './schema/user-settings.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const res = await this.userModel.create(createUserDto);
    await this.userSettingsModel.create({
      user: res._id,
    });
    return res;
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  async findUserSettingsById(id: string) {
    const user = await this.userModel.findById(id);
    return await this.userSettingsModel.find({ user: user._id });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
