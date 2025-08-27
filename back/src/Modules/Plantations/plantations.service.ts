// src/Modules/Plantations/services/plantations.service.ts

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ApplicationPlansService } from '../ApplicationPlans/applicationplans.service';

@Injectable()
export class PlantationsService {
  constructor(
    @InjectRepository(Plantations)
    private readonly plantationsRepo: Repository<Plantations>,
    private readonly recommendationsService: RecommendationsService,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    private readonly activityService: ActivityService,
    private readonly appPlansService: ApplicationPlansService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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

      const savedPlantation = await this.plantationsRepo.save(plantation); // ⭐⭐ Llama a la nueva función para generar el plan de aplicación ⭐⭐

      await this.appPlansService.generatePlanForPlantation(savedPlantation);

      await this.activityService.logActivity(
        savedPlantation.user,
        ActivityType.PLANTATION_CREATED,
        `El usuario creó la plantación '${savedPlantation.name}'.`,
      ); // Para que devuelva la plantación con el plan creado, puedes hacer una nueva búsqueda

      return this.findOne(savedPlantation.id);
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
      ownerName,
      sortBy = 'name',
      order = 'ASC',
      isActive, // <-- Extrae el nuevo filtro
    } = queryDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.plantationsRepo.createQueryBuilder('plantation');
    queryBuilder.leftJoinAndSelect('plantation.user', 'user');

    // --- APLICA FILTROS ---
    if (crop_type) {
      queryBuilder.andWhere('plantation.crop_type = :crop_type', { crop_type });
    }
    if (season) {
      queryBuilder.andWhere('plantation.season = :season', { season });
    }
    if (ownerName) {
      queryBuilder.andWhere('user.name ILIKE :ownerName', {
        ownerName: `%${ownerName}%`,
      });
    }
    // --- AÑADE EL FILTRO 'isActive' ---
    if (isActive !== undefined) {
      queryBuilder.andWhere('plantation.isActive = :isActive', { isActive });
    }

    // --- APLICA ORDENAMIENTO ---
    const validSortKeys: Record<string, string> = {
      name: 'plantation.name',
      ownerName: 'user.name',
      crop_type: 'plantation.crop_type',
      area_m2: 'plantation.area_m2',
      startDate: 'plantation.start_date',
      isActive: 'plantation.isActive',
    };
    const sortKey = validSortKeys[sortBy] || 'plantation.name';
    queryBuilder.orderBy(sortKey, order);

    try {
      const total = await queryBuilder.getCount();
      const plantations = await queryBuilder.skip(skip).take(limit).getMany();

      return {
        data: plantations,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al buscar las plantaciones: ${error.message}`,
        );
      }
      throw new BadRequestException(
        'Error desconocido al buscar las plantaciones',
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
        isActive: true,
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

  async getWeatherForPlantation(id: string) {
    const plantation = await this.plantationsRepo.findOneBy({ id });
    if (!plantation) {
      throw new NotFoundException(`Plantation with ID ${id} not found.`);
    }

    const coords = plantation.location.split(',');
    if (coords.length !== 2) {
      throw new BadRequestException(
        'Invalid location format in plantation data.',
      );
    }
    const lat = parseFloat(coords[0].trim());
    const lon = parseFloat(coords[1].trim());

    // Llamada a la API de OpenWeatherMap
    const apiKey = this.configService.getOrThrow<string>('WEATHER_API_KEY');
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

    try {
      // Hacer la petición y obtener la respuesta
      const response = await firstValueFrom(this.httpService.get(apiUrl));
      const weatherData = response.data;

      // Formatear la respuesta
      return {
        locationName: weatherData.name,
        temperature: `${weatherData.main.temp}°C`,
        feelsLike: `${weatherData.main.feels_like}°C`,
        humidity: `${weatherData.main.humidity}%`,
        description: weatherData.weather[0].description,
        windSpeed: `${weatherData.wind.speed} m/s`,
        icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
      };
    } catch (error) {
      console.error(
        'Error fetching weather data from OpenWeatherMap:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException('Failed to fetch weather data.');
    }
  }
  
  async setActivationStatus(id: string, isActive: boolean) {
    const plantation = await this.plantationsRepo.findOneBy({ id });
    if (!plantation) {
      throw new NotFoundException(`Plantation with id ${id} not found`);
    }
    plantation.isActive = isActive;
    await this.plantationsRepo.save(plantation);
    return {
      message: `Plantation ${isActive ? 'activated' : 'deactivated'} successfully.`,
    };
  }
}
