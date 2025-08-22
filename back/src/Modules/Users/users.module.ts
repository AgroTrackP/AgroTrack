import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { ActivityLog } from '../ActivityLogs/entities/activity-logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, ActivityLog])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
