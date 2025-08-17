// src/Guards/selfOnly.guard.ts

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
// Importa tu entidad de usuario directamente
import { Role } from '../Modules/Users/user.enum';

@Injectable()
export class SelfOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // ✅ Le decimos a TypeScript que 'user' es del tipo 'Users'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request.user;

    // Ahora 'user.id' no dará un error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userIdFromToken = user.sub;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userIdFromParams = request.params.id;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isAdmin = user.role === Role.Admin;

    if (isAdmin || userIdFromToken === userIdFromParams) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    );
  }
}
