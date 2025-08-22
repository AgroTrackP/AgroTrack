import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan } from './entities/subscriptionplan.entity';
import { Repository } from 'typeorm';
import { Users } from '../Users/entities/user.entity';
import { SuscriptionPlanService } from './subscriptionPlan.service';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';
import { CreateSuscriptionDto } from './dtos/createSubscriptionPlan.dto';
import { CreateMultipleSubscriptionsDto } from './dtos/createMultipleSubscription.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsActiveGuard } from 'src/Guards/isActive.guard';

@ApiTags('Subscription Plans')
@ApiBearerAuth('jwt')
@Controller('subscription-plan')
export class SuscriptionPlanController {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly suscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly suscriptionPlanService: SuscriptionPlanService,
  ) {}

  @Get()
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  async getAllSusPlans() {
    return await this.suscriptionPlanService.getAllSusPlansWithNum();
  }

  @Get(':id')
  async getSuscriptionPlan(@Param('id') id: string) {
    return await this.suscriptionPlanService.getSusById(id);
  }

  @Post()
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  async createSuscriptionPlan(@Body() suscriptionData: CreateSuscriptionDto) {
    return this.suscriptionPlanService.createSuscriptionPlan(suscriptionData);
  }

  @Post('manual-seed')
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
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
