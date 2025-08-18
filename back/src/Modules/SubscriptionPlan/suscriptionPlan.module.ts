import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { SubscriptionPlan } from './entities/suscriptionplan.entity';
import { SuscriptionPlanService } from './suscriptionPlan.service';
import { SuscriptionPlanController } from './suscriptionPlan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users, SubscriptionPlan])],
  controllers: [SuscriptionPlanController],
  providers: [SuscriptionPlanService],
  exports: [SuscriptionPlanService],
})
export class SubscriptionPlanModule {}
