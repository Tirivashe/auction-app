import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/types';

export const Roles = (...roles: Role[]) => {
  return SetMetadata('roles', roles);
};
