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
<<<<<<< Updated upstream
import { ActivityService } from '../ActivityLogs/activity-logs.service';
import { ActivityType } from '../ActivityLogs/entities/activity-logs.entity';
=======
import { PaginationDto } from './dtos/pagination.dto';
>>>>>>> Stashed changes

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
    private readonly activityService: ActivityService,
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

      await this.activityService.logActivity(
        plantation.user,
        ActivityType.PLANTATION_CREATED,
        `El usuario creó la plantación '${plantation.name}'.`,
      );

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

  async findAllPaginated(paginationDto: PaginationDto) {
    const { page = 1, limit = 5 } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      // 1. Crear el query builder desde la entidad Plantations
      const queryBuilder =
        this.plantationsRepo.createQueryBuilder('plantation');

      // 2. Unir las relaciones necesarias
      queryBuilder
        .leftJoinAndSelect('plantation.user', 'user')
        .leftJoinAndSelect('plantation.applicationPlans', 'applicationPlans');

      // 3. Obtener el conteo total de registros
      const total = await queryBuilder.getCount();

      // 4. Aplicar la paginación con skip y take
      const plantations = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('plantation.name', 'ASC') // Opcional: ordenar los resultados
        .getMany();

      return {
        data: plantations,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: unknown) {
      // Manejo de errores
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error fetching paginated plantations: ${error.message}`,
        );
      }
      throw new BadRequestException(
        'Unknown error fetching paginated plantations',
      );
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

      await this.activityService.logActivity(
        plantation.user,
        ActivityType.PLANTATION_UPDATED,
        'El usuario ha actualizado los datos de su plantación.',
      );

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
