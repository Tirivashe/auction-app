// TODO: add validation and extract enum to another file
enum Role {
  Admin = 'Admin',
  Regular = 'Regular',
}

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: Role;
}
