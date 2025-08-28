import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '../Modules/Users/user.enum';
import { AuthRequest } from 'src/types/express';

@Injectable()
export class SelfOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    const userIdFromToken = user.id;

    const userIdFromParams = request.params.id;

    const isAdmin = user.role === Role.Admin;

    if (isAdmin || userIdFromToken === userIdFromParams) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    );
  }
}
