import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  controllers: [StripeWebhookController],
  providers: [StripeService],
})
export class StripeModule {}
