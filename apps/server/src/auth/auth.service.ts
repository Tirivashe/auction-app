import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { SignUpDto } from './dto/auth-signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, password, username, role } = signUpDto;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.create({
        email,
        password: hashedPassword,
        username,
        role,
      });
      const token = this.jwtService.sign({ id: user._id });

      return { token };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const token = this.jwtService.sign({ id: user._id });
      return { token };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // async signUpAndLogin(userCredentials: CreateUserDto) {
  //   const existingUser = await this.userService.findOne(userCredentials.email);
  //   if (!!existingUser) {
  //     console.log(existingUser);
  //     throw new BadRequestException('User with this email already exists');
  //   }
  //   const { id, username, email } =
  //     await this.userService.create(userCredentials);
  //   return { id, username, email };
  // }
}
