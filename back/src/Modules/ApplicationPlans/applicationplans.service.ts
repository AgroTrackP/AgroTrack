import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationPlans } from './entities/applicationplan.entity';
import { ApplicationPlanItem } from './entities/applicationplan.item.entity';
import { CreateApplicationPlanDto } from './dtos/create.applicationplan.dto';
import { UpdateApplicationPlanDto } from './dtos/update.applicationplan.dto';
import { Users } from '../Users/entities/user.entity';
import { Plantations } from '../Plantations/entities/plantations.entity';
import { Diseases } from '../Diseases/entities/diseases.entity';
import { Products } from '../Products/entities/products.entity';

@Injectable()
export class ApplicationPlansService {
  constructor(
    @InjectRepository(ApplicationPlans)
    private readonly appPlanRepo: Repository<ApplicationPlans>,

    @InjectRepository(ApplicationPlanItem)
    private readonly appPlanItemRepo: Repository<ApplicationPlanItem>,

    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,

    @InjectRepository(Plantations)
    private readonly plantationRepo: Repository<Plantations>,

    @InjectRepository(Diseases)
    private readonly diseaseRepo: Repository<Diseases>,

    @InjectRepository(Products)
    private readonly productRepo: Repository<Products>,
  ) {}

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

        const item = this.appPlanItemRepo.create({
          dosage_per_m2: itemDto.dosage_per_m2,
          calculated_quantity: itemDto.calculated_quantity,
          applicationPlan: savedPlan,
          product,
        });
        items.push(item);
      }

      await this.appPlanItemRepo.save(items);

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
