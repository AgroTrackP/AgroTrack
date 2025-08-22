import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthRequest } from 'src/types/express';

@Injectable()
export class IsActiveGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request.');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'Your account is inactive. Please contact support.',
      );
    }

    return true;
  }
}
