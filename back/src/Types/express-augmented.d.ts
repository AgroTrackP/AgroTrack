import { Users } from 'src/Modules/Users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: Users;
    }
  }
}
