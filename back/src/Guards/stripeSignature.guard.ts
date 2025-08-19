import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from 'src/Modules/Stripe/stripe.service';

@Injectable()
export class StripeSignatureGuard implements CanActivate {
  constructor(private readonly stripeService: StripeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const sig = request.headers['stripe-signature'];

    if (!sig) {
      throw new BadRequestException('Missing stripe signature header.');
    }

    const signature = Array.isArray(sig) ? sig[0] : sig;

    try {
      const event = this.stripeService.constructEventFromPayload(
        request.body,
        signature,
      );
      (request as any).stripeEvent = event;
    } catch (error) {
      throw new BadRequestException('Webhook signature verification failed.');
    }

    return true;
  }
}
