import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [StripeWebhookController],
  providers: [StripeService],
})
export class StripeModule {}
