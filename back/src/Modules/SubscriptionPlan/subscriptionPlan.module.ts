import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { SubscriptionPlan } from './entities/subscriptionplan.entity';
import { SuscriptionPlanService } from './subscriptionPlan.service';
import { SuscriptionPlanController } from './subscriptionPlan.controller';
import { ActivityLogsModule } from '../ActivityLogs/activity-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, SubscriptionPlan]),
    ActivityLogsModule,
  ],
  controllers: [SuscriptionPlanController],
  providers: [SuscriptionPlanService],
  exports: [SuscriptionPlanService],
})
export class SubscriptionPlanModule {}
