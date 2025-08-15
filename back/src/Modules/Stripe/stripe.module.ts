import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { StripeWebhookController } from './stripeWebhook.controller';
import Stripe from 'stripe';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
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
  ],
})
export class StripeModule {}
