import { Role } from 'src/types';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: Role;
}
