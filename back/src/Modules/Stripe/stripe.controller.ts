import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { SelfOnlyGuard } from 'src/Guards/selfOnly.guard';
import { AuthRequest } from 'src/types/express';
import { IsActiveGuard } from 'src/Guards/isActive.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';

@ApiTags('Stripe')
@ApiBearerAuth('jwt')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // Endpoint para crear una sesión de checkout
  @Post('create-checkout-session')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, SelfOnlyCheckGuard)
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
    // Devuelve la URL al frontend para la redirección y el session ID
    return { url: session.url, id: session.id };
  }

  @Post('cancel/:id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, SelfOnlyGuard)
  @ApiOperation({ summary: 'Cancela la suscripción activa del usuario' })
  @ApiResponse({
    status: 200,
    description: 'La solicitud de cancelación ha sido procesada.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async cancelSubscription(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.id;
    return await this.stripeService.cancelSubscription(userId);
  }

  @Get('monthly-revenue')
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @Roles(Role.Admin)
  async getMonthlyRevenue() {
    return await this.stripeService.getMonthlyRevenue();
  }
}
