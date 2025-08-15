import { Users } from 'src/Modules/Users/entities/user.entity';
import { Role } from '../Modules/Users/user.enum';

export interface JwtPayload {
  sub: Users['id'];
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
