import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/Modules/Users/user.enum';
<<<<<<< HEAD
import { AuthRequest } from 'src/types/express';
=======
import { AuthRequest } from '../types/express';
>>>>>>> 083e84a32b5a880fb349e2320ca41debbe5f32a0

@Injectable()
export class SelfOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const user = request.user;
    const userIdFromToken = request.user.sub;
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
