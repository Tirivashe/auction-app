import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  expiresAt: Date;
}
