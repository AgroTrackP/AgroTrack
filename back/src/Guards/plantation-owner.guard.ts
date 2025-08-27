import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plantations } from 'src/Modules/Plantations/entities/plantations.entity';
import { Role } from 'src/Modules/Users/user.enum';
import { AuthRequest } from 'src/types/express';

@Injectable()
export class PlantationOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Plantations)
    private readonly plantationsRepository: Repository<Plantations>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;
    const plantationId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not found in request.');
    }

    if (user.role === Role.Admin) {
      return true;
    }

    const plantation = await this.plantationsRepository.findOne({
      where: { id: plantationId },
      relations: ['user'],
    });

    if (!plantation) {
      throw new NotFoundException(
        `Plantation with ID ${plantationId} not found.`,
      );
    }

    if (plantation.user.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return true;
  }
}
