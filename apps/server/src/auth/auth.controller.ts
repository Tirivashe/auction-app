import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUpAndLogin(@Body() userCredentials: CreateUserDto) {
    return this.authService.signUpAndLogin(userCredentials);
  }
}
