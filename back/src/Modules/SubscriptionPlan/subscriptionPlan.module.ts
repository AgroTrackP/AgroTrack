import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { SubscriptionPlan } from './entities/subscriptionplan.entity';
import { SuscriptionPlanService } from './subscriptionPlan.service';
import { SuscriptionPlanController } from './subscriptionPlan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users, SubscriptionPlan])],
  controllers: [SuscriptionPlanController],
  providers: [SuscriptionPlanService],
  exports: [SuscriptionPlanService],
})
export class SubscriptionPlanModule {}
