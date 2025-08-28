import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Diseases } from './entities/diseases.entity';
import { CreateDiseaseDto } from './dtos/create.disease.dto';
import { UpdateDiseaseDto } from './dtos/update.disease.dto';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';

@Injectable()
export class DiseasesService {
  constructor(
    @InjectRepository(Diseases)
    private readonly diseasesRepo: Repository<Diseases>,

    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,

    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
  ) {}

  async findAll() {
    return this.diseasesRepo.find({
      relations: ['user', 'applicationPlans', 'products'],
    });
  }

  async findOne(id: string) {
    const disease = await this.diseasesRepo.findOne({
      where: { id },
      relations: ['user', 'applicationPlans', 'products'],
    });
    if (!disease) {
      throw new NotFoundException(`Disease with id ${id} not found`);
    }
    return disease;
  }

  async create(payload: CreateDiseaseDto) {
    const disease = this.diseasesRepo.create({
      name: payload.name,
      description: payload.description,
    });

    if (payload.userId) {
      const user = await this.usersRepo.findOne({
        where: { id: payload.userId },
      });
      if (!user)
        throw new NotFoundException(`User with id ${payload.userId} not found`);
      disease.user = user;
    }

    if (payload.productIds && payload.productIds.length > 0) {
      const products = await this.productsRepo.findBy({
        id: In(payload.productIds),
      });
      if (products.length !== payload.productIds.length) {
        throw new NotFoundException('One or more products not found');
      }
      disease.products = products;
    }

    return this.diseasesRepo.save(disease);
  }

  async update(id: string, payload: UpdateDiseaseDto) {
    const disease = await this.diseasesRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!disease)
      throw new NotFoundException(`Disease with id ${id} not found`);

    if (payload.userId) {
      const user = await this.usersRepo.findOne({
        where: { id: payload.userId },
      });
      if (!user)
        throw new NotFoundException(`User with id ${payload.userId} not found`);
      disease.user = user;
    }

    if (payload.productIds) {
      const products = await this.productsRepo.findBy({
        id: In(payload.productIds),
      });
      if (products.length !== payload.productIds.length) {
        throw new NotFoundException('One or more products not found');
      }
      disease.products = products;
    }

    Object.assign(disease, payload);
    return this.diseasesRepo.save(disease);
  }

  async remove(id: string) {
    const disease = await this.diseasesRepo.findOne({ where: { id } });
    if (!disease)
      throw new NotFoundException(`Disease with id ${id} not found`);

    return this.diseasesRepo.remove(disease);
  }
}
