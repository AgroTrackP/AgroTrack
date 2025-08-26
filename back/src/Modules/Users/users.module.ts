import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { ActivityLog } from '../ActivityLogs/entities/activity-logs.entity';
import { StripeModule } from '../Stripe/stripe.module';
import { SubscriptionPlan } from '../SubscriptionPlan/entities/subscriptionplan.entity';
import { ActivityService } from '../ActivityLogs/activity-logs.service';
import { ActivityLogsModule } from '../ActivityLogs/activity-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, ActivityLog, SubscriptionPlan]),
    StripeModule,
    ActivityLogsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ActivityService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
