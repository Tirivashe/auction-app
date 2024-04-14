import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/types';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail({}, { message: 'Please enter the correct email' })
  @IsNotEmpty()
  email: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(5, { message: 'Password must be at least 5 characters' })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
