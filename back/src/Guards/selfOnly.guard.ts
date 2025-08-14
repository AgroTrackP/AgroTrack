import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/Modules/Users/user.enum';
import { AuthRequest } from 'src/types/express';
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
