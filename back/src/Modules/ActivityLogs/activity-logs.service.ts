import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog, ActivityType } from './entities/activity-logs.entity';
import { MoreThan, Repository } from 'typeorm';
import { Users } from '../Users/entities/user.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogsRepository: Repository<ActivityLog>,
  ) {}

  // Método para registrar una actividad
  async logActivity(user: Users, type: ActivityType, description: string) {
    const newLog = this.activityLogsRepository.create({
      user,
      type,
      description,
    });
    await this.activityLogsRepository.save(newLog);
  }

  async findAll(page = 1, limit = 10) {
    // Usamos findAndCount para obtener también el total para la paginación
    const [data, total] = await this.activityLogsRepository.findAndCount({
      // 1. CORRECCIÓN: La relación es 'user' (singular)
      relations: ['user'],

      // 2. CORRECCIÓN: Ordenar por la columna de fecha correcta (usualmente 'createdAt')
      order: { timestamp: 'DESC' },

      take: limit,
      skip: (page - 1) * limit,
    });

    // Devolvemos un objeto compatible con la paginación del frontend
    return { data, total, page, limit };
  }

  async countNewSubscriptionsLast30Days(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const count = await this.activityLogsRepository.count({
        where: {
          type: ActivityType.SUBSCRIPTION_STARTED,
          timestamp: MoreThan(thirtyDaysAgo),
        },
      });

      return count;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error counting new subscriptions: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while counting new subscriptions.',
      );
    }
  }
}
