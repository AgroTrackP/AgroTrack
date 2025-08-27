import { Users } from '../Users/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: Users;
  }
}
