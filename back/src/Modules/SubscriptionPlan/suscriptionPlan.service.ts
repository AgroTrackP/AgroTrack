import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan } from './entities/suscriptionplan.entity';
import { Repository } from 'typeorm';
import { Users } from '../Users/entities/user.entity';
import { CreateSuscriptionDto } from './dtos/createSuscriptionPlan.dto';

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

  async bulkCreatePlans(plansData: CreateSuscriptionDto[]) {
    try {
      const createdSuscriptions: SubscriptionPlan[] = [];
      for (const suscriptionData of plansData) {
        const result = await this.createSuscriptionPlan(suscriptionData);
        createdSuscriptions.push(result.suscriptionCreated);
      }
      return {
        message: 'Subscriptions created successfully.',
        data: createdSuscriptions,
      };
    } catch (error) {
      throw new BadRequestException(`Error creating subscriptions: ${error}`);
    }
  }
}
