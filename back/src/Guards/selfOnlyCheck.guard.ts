import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Users } from '../Modules/Users/entities/user.entity';
import { CreateCheckoutSessionDto } from 'src/Modules/Stripe/dtos/createCheckoutSession.dto';

@Injectable()
export class SelfOnlyCheckGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user: Users = request.user;

    const userIdFromToken = user.id;

    const { userId: userIdFromDto } = request.body as CreateCheckoutSessionDto;

    if (userIdFromToken === userIdFromDto) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    );
  }
}
