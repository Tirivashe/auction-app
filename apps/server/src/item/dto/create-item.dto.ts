import {
  IsDateString,
  IsMimeType,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsMimeType()
  @IsOptional()
  image?: string;

  @IsDateString()
  @IsNotEmpty()
  expiresAt: Date;
}
