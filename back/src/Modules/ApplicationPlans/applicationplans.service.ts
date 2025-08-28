import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ApplicationPlans } from './entities/applicationplan.entity';
import { ApplicationPlanItem } from './entities/applicationplan.item.entity';
import { CreateApplicationPlanDto } from './dtos/create.applicationplan.dto';
import { UpdateApplicationPlanDto } from './dtos/update.applicationplan.dto';
import { Users } from '../Users/entities/user.entity';
import { Plantations } from '../Plantations/entities/plantations.entity';
import { Diseases } from '../Diseases/entities/diseases.entity';
import { Products } from '../Products/entities/products.entity';
import { RecommendationsService } from '../Recomendations/recomendations.service';
import { Status } from './status.enum';

@Injectable()
export class ApplicationPlansService {
  constructor(
    @InjectRepository(ApplicationPlans)
    private readonly appPlanRepo: Repository<ApplicationPlans>,

    @InjectRepository(ApplicationPlanItem)
    private readonly appPlanIteRepo: Repository<ApplicationPlanItem>,

    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,

    @InjectRepository(Plantations)
    private readonly plantationRepo: Repository<Plantations>,

    @InjectRepository(Diseases)
    private readonly diseaseRepo: Repository<Diseases>,

    @InjectRepository(Products)
    private readonly productRepo: Repository<Products>,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  // ⭐⭐⭐ Nuevo método para generar un plan de forma automática ⭐⭐⭐
  async generatePlanForPlantation(plantation: Plantations) {
    try {
      const recommendation = await this.recommendationsService.findByCropType(
        plantation.crop_type,
      );

      if (!recommendation) {
        console.warn(
          `No se encontró una recomendación para el tipo de cultivo: ${plantation.crop_type}`,
        );
        return null; // O manejarlo como prefieras
      }

      // 1. Selecciona la primera enfermedad y productos recomendados
      const disease = recommendation.recommended_diseases?.[0];
      const products = recommendation.recommended_products;

      if (!disease || !products || products.length === 0) {
        console.warn(
          `La recomendación para ${plantation.crop_type} no tiene la información necesaria (enfermedad o productos).`,
        );
        return null;
      }

      // 2. Calcula las cantidades
      const totalWater =
        recommendation.recommended_water_per_m2 * plantation.area_m2;
      const totalProduct = products.reduce(
        (acc, prod) => acc + prod.water_per_liter * plantation.area_m2,
        0,
      );
      const planned_date = new Date();
      planned_date.setDate(planned_date.getDate() + 2);
      // 3. Crea el plan de aplicación
      const appPlan = this.appPlanRepo.create({
        planned_date, // O la fecha que consideres apropiada
        total_water: totalWater,
        total_product: totalProduct,
        status: Status.PENDING,
        user: plantation.user,
        plantation: plantation,
        disease: disease,
      });

      const savedPlan = await this.appPlanRepo.save(appPlan);

      // 4. Crea los items del plan
      const items = products.map((product) => {
        return this.appPlanIteRepo.create({
          dosage_per_m2: product.water_per_liter, // Asumimos que la dosificación es la misma que la recomendación de agua
          calculated_quantity: product.water_per_liter * plantation.area_m2,
          applicationPlan: savedPlan,
          product: product,
        });
      });

      await this.appPlanIteRepo.save(items);

      return savedPlan;
    } catch (error) {
      console.error('Error generando el plan de aplicación automático:', error);
      throw new InternalServerErrorException(
        'Error generating automatic application plan',
      );
    }
  }

  async create(createDto: CreateApplicationPlanDto): Promise<ApplicationPlans> {
    try {
      // Verificar relaciones
      const user = await this.userRepo.findOneBy({ id: createDto.user_id });
      if (!user) throw new NotFoundException('User not found');

      const plantation = await this.plantationRepo.findOneBy({
        id: createDto.plantation_id,
      });
      if (!plantation) throw new NotFoundException('Plantation not found');

      const disease = await this.diseaseRepo.findOneBy({
        id: createDto.disease_id,
      });
      if (!disease) throw new NotFoundException('Disease not found');

      const appPlan = this.appPlanRepo.create({
        planned_date: createDto.planned_date,
        total_water: createDto.total_water,
        total_product: createDto.total_product,
        status: createDto.status || undefined,
        user,
        plantation,
        disease,
      });

      const savedPlan = await this.appPlanRepo.save(appPlan);

      // Crear items relacionados
      const items: ApplicationPlanItem[] = [];
      for (const itemDto of createDto.items) {
        const product = await this.productRepo.findOneBy({
          id: itemDto.product_id,
        });
        if (!product)
          throw new NotFoundException(
            `Product with id ${itemDto.product_id} not found`,
          );

        const item = this.appPlanIteRepo.create({
          dosage_per_m2: itemDto.dosage_per_m2,
          calculated_quantity: itemDto.calculated_quantity,
          applicationPlan: savedPlan,
          product,
        });
        items.push(item);
      }

      await this.appPlanIteRepo.save(items);

      // Retornar con items cargados
      const plan = await this.appPlanRepo.findOne({
        where: { id: savedPlan.id },
        relations: ['user', 'plantation', 'disease', 'items', 'items.product'],
      });

      if (!plan)
        throw new InternalServerErrorException(
          'Error loading created application plan',
        );

      return plan;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error creating application plan');
    }
  }

  // ✅ MÉTODO MODIFICADO para aceptar un rango de fechas
  async findPendingPlans(userId: string, startDate?: string, endDate?: string) {
    let plannedDateCondition;

    if (startDate && endDate) {
      // Si se proporcionan las fechas, busca en ese rango
      plannedDateCondition = Between(new Date(startDate), new Date(endDate));
    } else {
      // Si no, usa la lógica para el día de mañana
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startOfTomorrow = new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        0,
        0,
        0,
        0,
      );
      const endOfTomorrow = new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        23,
        59,
        59,
        999,
      );
      plannedDateCondition = Between(startOfTomorrow, endOfTomorrow);
    }

    return this.appPlanRepo.find({
      where: {
        user: { id: userId },
        status: Status.PENDING,
        planned_date: plannedDateCondition,
      },
      relations: ['user', 'plantation', 'disease', 'items', 'items.product'],
    });
  }

  async findAll(): Promise<ApplicationPlans[]> {
    return this.appPlanRepo.find({
      relations: ['user', 'plantation', 'disease', 'items', 'items.product'],
    });
  }

  async findOne(id: string): Promise<ApplicationPlans> {
    const plan = await this.appPlanRepo.findOne({
      where: { id },
      relations: ['user', 'plantation', 'disease', 'items', 'items.product'],
    });
    if (!plan) throw new NotFoundException('Application plan not found');
    return plan;
  }

  async update(
    id: string,
    updateDto: UpdateApplicationPlanDto,
  ): Promise<ApplicationPlans> {
    try {
      const plan = await this.appPlanRepo.findOneBy({ id });
      if (!plan) throw new NotFoundException('Application plan not found');

      Object.assign(plan, updateDto);

      if (updateDto.user_id) {
        const user = await this.userRepo.findOneBy({ id: updateDto.user_id });
        if (!user) throw new NotFoundException('User not found');
        plan.user = user;
      }
      if (updateDto.plantation_id) {
        const plantation = await this.plantationRepo.findOneBy({
          id: updateDto.plantation_id,
        });
        if (!plantation) throw new NotFoundException('Plantation not found');
        plan.plantation = plantation;
      }
      if (updateDto.disease_id) {
        const disease = await this.diseaseRepo.findOneBy({
          id: updateDto.disease_id,
        });
        if (!disease) throw new NotFoundException('Disease not found');
        plan.disease = disease;
      }

      const updated = await this.appPlanRepo.save(plan);
      return this.findOne(updated.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating application plan');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const plan = await this.appPlanRepo.findOneBy({ id });
      if (!plan) throw new NotFoundException('Application plan not found');
      await this.appPlanRepo.remove(plan);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting application plan');
    }
  }
}
