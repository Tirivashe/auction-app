export class CreateItemDto {
  name: string;
  description: string;
  price: number;
  image: string;
  expiresAt: Date;
  isActive?: boolean;
}
