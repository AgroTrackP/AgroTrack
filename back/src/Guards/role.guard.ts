// src/Guards/role.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../Modules/Auth/decorators/roles.decorator';
import { Users } from '../Modules/Users/entities/user.entity';
import { Role } from '../Modules/Users/user.enum';

@Injectable() // ✅ Asegúrate de tener este decorador
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user: Users = request.user;

    return requiredRoles.includes(user.role);
  }
}
