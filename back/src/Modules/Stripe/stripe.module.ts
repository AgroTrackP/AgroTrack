import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { StripeWebhookController } from './stripeWebhook.controller';
import Stripe from 'stripe';
import { SubscriptionPlan } from '../SubscriptionPlan/entities/subscriptionplan.entity';
import { MailService } from '../nodemailer/mail.service';
import { ActivityLogsModule } from '../ActivityLogs/activity-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, SubscriptionPlan]),
    ActivityLogsModule,
  ],
  controllers: [StripeWebhookController, StripeController],
  providers: [
    StripeService,
    {
      provide: 'STRIPE_CLIENT',
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2025-07-30.basil',
        });
      },
    },
    MailService,
  ],
  exports: [StripeService],
})
export class StripeModule {}
