import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUpAndLogin(userCredentials: CreateUserDto) {
    const existingUser = await this.userService.findOne(userCredentials.email);
    if (!!existingUser) {
      console.log(existingUser);
      throw new BadRequestException('User with this email already exists');
    }
    const { id, username, email } =
      await this.userService.create(userCredentials);
    return { id, username, email };
  }
}
