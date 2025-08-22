import { Module } from '@nestjs/common';
import { ActivityLogsController } from './activity.logs.controller';
import { ActivityService } from './activity-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  controllers: [ActivityLogsController],
  providers: [ActivityService],
  exports: [ActivityService, TypeOrmModule],
})
export class ActivityLogsModule {}
