// src/Modules/Plantations/services/plantations.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plantations } from './entities/plantations.entity';
import { UpdatePlantationDto } from './dtos/update.plantation.dto';
import { CreatePlantationDto } from './dtos/create.plantation.dto';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { RecommendationsService } from '../Recomendations/recomendations.service';

@Injectable()
export class PlantationsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Plantations)
    private readonly plantationsRepo: Repository<Plantations>,
    private readonly recommendationsService: RecommendationsService,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async create(payload: CreatePlantationDto) {
    try {
      const plantation = this.plantationsRepo.create(payload);

      if (payload.userId) {
        const user = await this.usersRepo.findOne({
          where: { id: payload.userId },
        });
        if (!user)
          throw new NotFoundException(
            `User with id ${payload.userId} not found`,
          );
        plantation.user = user;
      }

      return await this.plantationsRepo.save(plantation);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al crear plantación: ${error.message}`,
        );
      }
      throw new BadRequestException('Error desconocido al crear plantación');
    }
  }

  async findAll() {
    try {
      return await this.plantationsRepo.find({
        relations: ['user', 'applicationPlans'],
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al obtener plantaciones: ${error.message}`,
        );
      }
      throw new BadRequestException(
        'Error desconocido al obtener plantaciones',
      );
    }
  }

  async findOne(id: string) {
    try {
      // 1. Consulta para obtener la plantación y sus planes de aplicación anidados
      const plantation = await this.plantationsRepo.findOne({
        where: { id },
        relations: [
          'user',
          'applicationPlans',
          'applicationPlans.disease',
          'applicationPlans.items',
          'applicationPlans.items.product',
          'applicationPlans.items.product.category',
        ],
        order: {
          applicationPlans: {
            planned_date: 'ASC', // Ordena los planes por fecha
          },
        },
      });

      if (!plantation) {
        throw new NotFoundException(`Plantation with id ${id} not found`);
      }

      // 2. Consulta para obtener las recomendaciones basadas en el tipo de cultivo de la plantación
      const recommendations = await this.recommendationsService.findByCropType(
        plantation.crop_type,
      );

      const result = {
        ...plantation,
        recommendations: recommendations || null, // Agrega la recomendación al objeto
      };

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al buscar plantación: ${error.message}`,
        );
      }
      throw new BadRequestException('Error desconocido al buscar plantación');
    }
  }

  async update(id: string, payload: UpdatePlantationDto) {
    try {
      const plantation = await this.plantationsRepo.findOne({ where: { id } });
      if (!plantation)
        throw new NotFoundException(`Plantation with id ${id} not found`);

      if (payload.userId) {
        const user = await this.usersRepo.findOne({
          where: { id: payload.userId },
        });
        if (!user)
          throw new NotFoundException(
            `User with id ${payload.userId} not found`,
          );
        plantation.user = user;
      }

      Object.assign(plantation, payload);
      return await this.plantationsRepo.save(plantation);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al actualizar plantación: ${error.message}`,
        );
      }
      throw new BadRequestException(
        'Error desconocido al actualizar plantación',
      );
    }
  }

  async remove(id: string) {
    try {
      const plantation = await this.plantationsRepo.findOne({ where: { id } });
      if (!plantation)
        throw new NotFoundException(`Plantation with id ${id} not found`);

      return await this.plantationsRepo.remove(plantation);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al eliminar plantación: ${error.message}`,
        );
      }
      throw new BadRequestException('Error desconocido al eliminar plantación');
    }
  }

  async findByUser(userId: string): Promise<Plantations[]> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['plantations'],
      });
      if (!user) {
        throw new BadRequestException('User does not exist.');
      }
      if (!user.plantations) {
        throw new NotFoundException('User does not have plantatios yet.');
      }

      return user.plantations;
    } catch (error) {
      throw new BadRequestException(
        `Error fetching user plantations: ${error}`,
      );
    }
  }
}
