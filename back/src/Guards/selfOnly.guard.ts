import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '../Modules/Users/user.enum';
import { AuthRequest } from 'src/types/express';
import { JwtPayload } from 'src/types/jwt-payload.interface';

@Injectable()
export class SelfOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // --- CAMBIO CLAVE AQUÍ ---
    // Hacemos la conversión en dos pasos para satisfacer a TypeScript
    const user = request.user as unknown as JwtPayload;

    if (!user) {
      throw new ForbiddenException('Authentication credentials not found.');
    }

    const userIdFromToken = user.sub;
    const userIdFromParams = request.params.id;

    const isAdmin =
      typeof user.role === 'string' &&
      user.role.toLowerCase() === Role.Admin.toLowerCase();

    if (isAdmin || userIdFromToken === userIdFromParams) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    );
  }
}
