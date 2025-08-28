import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SuscriptionPlanService } from './subscriptionPlan.service';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';
import { CreateSuscriptionDto } from './dtos/createSubscriptionPlan.dto';
import { CreateMultipleSubscriptionsDto } from './dtos/createMultipleSubscription.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActivityService } from '../ActivityLogs/activity-logs.service';
import { IsActiveGuard } from 'src/Guards/isActive.guard';
import { SelfOnlyGuard } from 'src/Guards/selfOnly.guard';

@ApiTags('Subscription Plans')
@ApiBearerAuth('jwt')
@Controller('subscription-plan')
export class SuscriptionPlanController {
  constructor(
    private readonly suscriptionPlanService: SuscriptionPlanService,
    private readonly activityService: ActivityService,
  ) {}

  @Get()
  async getAllSusPlans() {
    return await this.suscriptionPlanService.getAllSusPlans();
  }

  @Get('new-last-30-days')
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get the count of new subscriptions in the last 30 days',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the total number of new subscriptions',
    schema: { example: { newSubscriptions: 42 } },
  })
  async getNewSubscriptionsCount() {
    const count = await this.activityService.countNewSubscriptionsLast30Days();
    return { newSubscriptions: count };
  }

  @Get('stats/user-counts')
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get the count of users for each subscription plan (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns an object with the total number of users for each plan.',
    schema: { example: { basic: 120, pro: 55, premium: 23 } },
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  async getUserCountsByPlan() {
    return await this.suscriptionPlanService.getUserCountsByPlan();
  }

  @Get(':id')
  async getSuscriptionPlan(@Param('id') id: string) {
    return await this.suscriptionPlanService.getSusById(id);
  }

  @Post()
  @UseGuards(PassportJwtAuthGuard, SelfOnlyGuard)
  async createSuscriptionPlan(@Body() suscriptionData: CreateSuscriptionDto) {
    return this.suscriptionPlanService.createSuscriptionPlan(suscriptionData);
  }

  @Post('manual-seed')
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @Roles(Role.Admin)
  async createMultipleSuscriptionPlans(
    @Body() multipleSuscriptionData: CreateMultipleSubscriptionsDto,
  ) {
    const createdPlans = await this.suscriptionPlanService.bulkCreatePlans(
      multipleSuscriptionData.plans,
    );

    if (createdPlans.length === 0) {
      return {
        message:
          'All subscription plans already existed. No new plans were created.',
      };
    }

    return {
      message: `${createdPlans.length} subscription plans created successfully.`,
      data: createdPlans,
    };
  }
}
