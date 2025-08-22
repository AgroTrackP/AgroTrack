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

  // Esta función para nada se hizo con Gemini -F
  async getAllSusPlansWithNum() {
    try {
      const plansWithUserCount = await this.suscriptionPlanRepository
        .createQueryBuilder('plan') // 1. Empezamos a construir la consulta desde la entidad SubscriptionPlan (alias 'plan')
        .leftJoin('plan.users', 'user') // 2. Unimos con la tabla de usuarios (alias 'user')
        .select('plan.name', 'name') // 3. Seleccionamos el nombre del plan y le damos un alias 'name'
        .addSelect('COUNT(user.id)', 'userCount') // 4. Contamos los IDs de los usuarios unidos y le damos el alias 'userCount'
        .groupBy('plan.name') // 5. Agrupamos los resultados por el nombre del plan para que el conteo sea correcto
        .getRawMany(); // 6. Obtenemos los resultados en formato crudo (raw)

      // El resultado será un array de objetos como: [{ name: 'Básico', userCount: '5' }]
      // Convertimos el conteo a número
      const formattedResult = plansWithUserCount.map((plan) => ({
        planName: plan.name,
        numberOfUsers: parseInt(plan.userCount, 10),
      }));

      return formattedResult;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching subscription plans with user count: ${error.message}`,
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
