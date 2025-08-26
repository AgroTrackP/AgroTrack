import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan } from './entities/subscriptionplan.entity';
import { Repository } from 'typeorm';
import { Users } from '../Users/entities/user.entity';
import { CreateSuscriptionDto } from './dtos/createSubscriptionPlan.dto';

@Injectable()
export class SuscriptionPlanService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly suscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getAllSusPlans() {
    try {
      return await this.suscriptionPlanRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching subscription plans: ${error.message}`,
      );
    }
  }

  async getUserCountsByPlan(): Promise<{
    basic: number;
    pro: number;
    premium: number;
  }> {
    try {
      const plansWithUserCount = await this.suscriptionPlanRepository
        .createQueryBuilder('plan')
        .leftJoin('plan.users', 'user')
        .select('plan.name', 'planName')
        .addSelect('COUNT(user.id)', 'userCount')
        .groupBy('plan.name')
        .getRawMany();

      const counts = {
        basic: 0,
        pro: 0,
        premium: 0,
      };

      for (const result of plansWithUserCount) {
        const planName = result.planName.toLowerCase();
        if (counts.hasOwnProperty(planName)) {
          counts[planName] = parseInt(result.userCount, 10);
        }
      }

      return counts;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error fetching user counts by plan: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching user counts.',
      );
    }
  }

  async getSusById(id: string) {
    try {
      const susPlan = await this.suscriptionPlanRepository.findOne({
        where: { id },
      });
      if (!susPlan) {
        throw new NotFoundException(`Suscription does not exist.`);
      }
      return susPlan;
    } catch (error) {
      throw new BadRequestException(
        `Error fetching suscription. Error: ${error}`,
      );
    }
  }

  async createSuscriptionPlan(suscriptionData: CreateSuscriptionDto) {
    try {
      const suscriptionCreated =
        this.suscriptionPlanRepository.create(suscriptionData);
      await this.suscriptionPlanRepository.save(suscriptionCreated);
      return {
        message: 'Suscription created.',
        suscriptionCreated,
      };
    } catch (error) {
      throw new BadRequestException(`Error creating suscription: ${error}`);
    }
  }

  async bulkCreatePlans(
    plansData: CreateSuscriptionDto[],
  ): Promise<SubscriptionPlan[]> {
    const createdPlans: SubscriptionPlan[] = [];

    // Usamos un bucle for...of para poder usar await dentro de él
    for (const planData of plansData) {
      // 1. Verificamos si el plan ya existe para no crear duplicados
      const planExists = await this.suscriptionPlanRepository.findOneBy({
        stripePriceId: planData.stripePriceId,
      });

      // 2. Si no existe, lo creamos
      if (!planExists) {
        const newPlan = this.suscriptionPlanRepository.create(planData);
        const savedPlan = await this.suscriptionPlanRepository.save(newPlan);
        createdPlans.push(savedPlan);
      }
    }

    return createdPlans;
  }
}
