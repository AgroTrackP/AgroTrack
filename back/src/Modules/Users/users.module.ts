import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { ActivityLog } from '../ActivityLogs/entities/activity-logs.entity';
import { StripeModule } from '../Stripe/stripe.module';
import { SubscriptionPlan } from '../SubscriptionPlan/entities/subscriptionplan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, ActivityLog, SubscriptionPlan]),
    StripeModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
