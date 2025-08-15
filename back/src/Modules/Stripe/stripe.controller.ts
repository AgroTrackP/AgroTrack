import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCheckoutSessionDto } from './dtos/createCheckoutSession.dto';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { SelfOnlyCheckGuard } from 'src/Guards/selfOnlyCheck.guard';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // Endpoint para crear una sesión de checkout
  @ApiBearerAuth('jwt')
  @Post('create-checkout-session')
  @UseGuards(PassportJwtAuthGuard, SelfOnlyCheckGuard)
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear sesión de checkout' })
  @ApiBody({ type: CreateCheckoutSessionDto })
  @ApiResponse({
    status: 201,
    description: 'URL de sesión de checkout creada',
    schema: {
      example: { url: 'https://checkout.stripe.com/session/abc123' },
    },
  })
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    const { userId, priceId } = createCheckoutSessionDto;
    const session = await this.stripeService.createCheckoutSession(
      priceId,
      userId,
    );
    // Devuelve la URL al frontend para la redirección
    return { url: session.url };
  }
}
