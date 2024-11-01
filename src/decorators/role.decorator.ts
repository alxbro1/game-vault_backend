import { SetMetadata } from '@nestjs/common';
import { enumRole } from '../enums/role.enum'; 

export const Role = (role: enumRole) => SetMetadata('role', role);
