import { Users } from 'src/Modules/Users/entities/user.entity';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: Users;
}
