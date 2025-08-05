import { Role } from 'src/Modules/Users/user.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
