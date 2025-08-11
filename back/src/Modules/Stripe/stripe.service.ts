import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Users } from '../Users/entities/user.entity';

@Injectable()
export class StripeService {
  constructor(
    @InjectRepository(Users) private userDbService: Repository<Users>,
  ) {}
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil',
  });

  async createCheckoutSession(
    priceId: string,
    userId: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const user = await this.userDbService.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: user.email,
        success_url: String.raw`${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Unable to create checkout session');
    }
  }
}
