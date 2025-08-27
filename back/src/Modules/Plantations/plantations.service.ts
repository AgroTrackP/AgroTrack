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
import { ActivityService } from '../ActivityLogs/activity-logs.service';
import { ActivityType } from '../ActivityLogs/entities/activity-logs.entity';
import { QueryPlantationsDto } from './dtos/pagination.dto';

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

  // En tu plantations.service.ts

  async findAllPaginated(queryDto: QueryPlantationsDto) {
    const {
      page = 1,
      limit = 10,
      crop_type,
      season,
      sortBy = 'name',
      order = 'ASC',
      ownerName, // <-- Extrae el nuevo filtro
    } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.plantationsRepo.createQueryBuilder('plantation');
    queryBuilder.leftJoinAndSelect('plantation.user', 'user');

    if (crop_type) {
      queryBuilder.andWhere('plantation.crop_type = :crop_type', { crop_type });
    }
    if (season) {
      queryBuilder.andWhere('plantation.season = :season', { season });
    }
    // --- AÑADE ESTA LÓGICA DE FILTRADO ---
    if (ownerName) {
      queryBuilder.andWhere('user.name ILIKE :ownerName', {
        ownerName: `%${ownerName}%`,
      });
    }

    // Valida que sortBy sea una columna segura para ordenar
    const validSortKeys: Record<string, string> = {
      name: 'plantation.name',
      ownerName: 'user.name',
      crop_type: 'plantation.crop_type',
      area_m2: 'plantation.area_m2',
      startDate: 'plantation.start_date',
    };
    const sortKey = validSortKeys[sortBy] || 'plantation.name';

    try {
      const total = await queryBuilder.getCount();
      const plantations = await queryBuilder
        .orderBy(sortKey, order)
        .skip(skip)
        .take(limit)
        .getMany();

      return {
        data: plantations,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error al buscar las plantaciones: ${error.message}`,
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

  async findByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Usamos findAndCount para obtener los terrenos de una página y el total
    const [plantations, total] = await this.plantationsRepo.findAndCount({
      where: {
        user: {
          id: userId,
        },
      },
      take: limit,
      skip: skip,
      order: { name: 'ASC' }, // Opcional: para un orden consistente
    });

    return {
      data: plantations,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(
    id: string,
    isActive: boolean,
  ): Promise<{ message: string; status: boolean }> {
    const plantation = await this.plantationsRepo.findOneBy({ id });

    if (!plantation) {
      throw new NotFoundException(`Plantation with ID ${id} not found.`);
    }

    plantation.isActive = isActive;
    await this.plantationsRepo.save(plantation);

    const message = isActive
      ? 'Plantation has been activated.'
      : 'Plantation has been deactivated.';

    return { message, status: plantation.isActive };
  }
}
