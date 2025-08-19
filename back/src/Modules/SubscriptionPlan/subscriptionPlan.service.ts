import {
  BadRequestException,
  Injectable,
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
      return this.suscriptionPlanRepository.find();
    } catch (error) {
      throw new BadRequestException(
        `Error fetching suscriptions. Error: ${error}`,
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
