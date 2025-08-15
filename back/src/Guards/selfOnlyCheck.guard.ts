import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Users } from '../Modules/Users/entities/user.entity';
import { Role } from '../Modules/Users/user.enum';
import { CreateCheckoutSessionDto } from 'src/Modules/Stripe/dtos/createCheckoutSession.dto';

@Injectable()
export class SelfOnlyCheckGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // ✅ Le decimos a TypeScript que 'user' es del tipo 'Users'
    const user: Users = request.user;
    const userIdFromToken = user.id;

    // --- CAMBIO CLAVE AQUÍ ---
    // Obtener el ID del usuario del cuerpo de la solicitud
    const { userId: userIdFromDto } = request.body as CreateCheckoutSessionDto;
    // -------------------------

    // Ahora 'user.id' no dará un error
    const isAdmin = user.role === Role.Admin;

    if (isAdmin || userIdFromToken === userIdFromDto) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    );
  }
}
