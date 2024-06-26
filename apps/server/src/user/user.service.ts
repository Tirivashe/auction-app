import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserSettings } from './schema/user-settings.schema';
import { BiddingHistory } from 'src/bid/schema/bid-history.schema';
import { ToggleAutobidDto } from 'src/item/dto/toggle-autobid.dto';
import { UserSettingsDto } from './dto/user-settings.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
    @InjectModel(BiddingHistory.name)
    private readonly biddingHistoryModel: Model<BiddingHistory>,
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

  async findUserSettingsById(id: string): Promise<UserSettings> {
    const user = await this.userModel.findById(id);
    return await this.userSettingsModel.findOne({ user: user._id });
  }

  async setUserSettings(userId: string, userSettingsDto: UserSettingsDto) {
    const userSettings = await this.userSettingsModel.findOne({ user: userId });
    if (!userSettings) {
      await this.userSettingsModel.create({ user: userId, ...userSettingsDto });
    } else {
      await this.userSettingsModel.findOneAndUpdate(
        { user: userId },
        { $set: userSettingsDto },
        { new: true },
      );
    }

    return {
      message: 'User settings updated',
      statusCode: HttpStatus.OK,
      error: null,
    };
  }

  async getBiddingHistory(userId: string): Promise<BiddingHistory[]> {
    return await this.biddingHistoryModel
      .find({ user: userId })
      .populate('bids')
      .populate('item');
  }

  async toggleAutobid(toggleAutobidDto: ToggleAutobidDto) {
    const userBid = await this.biddingHistoryModel.findOne({
      user: toggleAutobidDto.userId,
      item: toggleAutobidDto.itemId,
    });
    if (!userBid) {
      return;
    }
    userBid.autobid = !userBid.autobid;
    await userBid.save();
    return {
      message: 'Auto-bid changed',
      statusCode: HttpStatus.OK,
      error: null,
    };
  }
}
