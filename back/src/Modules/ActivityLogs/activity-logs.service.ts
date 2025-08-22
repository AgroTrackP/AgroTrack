import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog, ActivityType } from './entities/activity-logs.entity';
import { Repository } from 'typeorm';
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
    return this.activityLogsRepository.find({
      relations: ['users'],
      order: { timestamp: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
  }
}
