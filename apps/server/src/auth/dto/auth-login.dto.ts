import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please enter the correct email' })
  @IsNotEmpty()
  email: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(5, { message: 'Password must be at least 5 characters' })
  password: string;
}
