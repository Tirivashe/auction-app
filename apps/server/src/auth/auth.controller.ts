import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/auth-signup.dto';
import { LoginDto } from './dto/auth-login.dto';
import { User } from 'src/user/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ token: string; user: User }> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ token: string; user: User }> {
    return await this.authService.login(loginDto);
  }
}
