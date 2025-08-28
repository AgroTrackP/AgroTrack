import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phenology } from './entities/phenologies.entity';
import { CreatePhenologyDto } from './dtos/create.phenology.dto';
import { UpdatePhenologyDto } from './dtos/update.phenology.dto';
import { Users } from 'src/Modules/Users/entities/user.entity';

@Injectable()
export class PhenologiesService {
  constructor(
    @InjectRepository(Phenology)
    private readonly phenologiesRepo: Repository<Phenology>,

    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async create(payload: CreatePhenologyDto) {
    try {
      const phenology = this.phenologiesRepo.create(payload);

      if (payload.userId) {
        const user = await this.usersRepo.findOne({
          where: { id: payload.userId },
        });
        if (!user) {
          throw new NotFoundException(
            `User with ID ${payload.userId} not found`,
          );
        }
        phenology.user = user;
      }

      return await this.phenologiesRepo.save(phenology);
    } catch (error) {
      throw new BadRequestException(`Error creating phenology: ${error}`);
    }
  }

  async findAll() {
    try {
      return await this.phenologiesRepo.find({
        relations: ['user'],
      });
    } catch (error) {
      throw new BadRequestException(
        `Error retrieving phenologies: ${(error as Error).message}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const phenology = await this.phenologiesRepo.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!phenology) {
        throw new NotFoundException(`Phenology with ID ${id} not found`);
      }
      return phenology;
    } catch (error) {
      throw new BadRequestException(`Error finding phenology: ${error}`);
    }
  }

  async update(id: string, updatephenologydto: UpdatePhenologyDto) {
    try {
      const phenology = await this.phenologiesRepo.findOne({
        where: { id },
      });
      if (!phenology) {
        throw new NotFoundException(`Phenology with ID ${id} not found`);
      }

      if (updatephenologydto.userId) {
        const user = await this.usersRepo.findOne({
          where: { id: updatephenologydto.userId },
        });
        if (!user) {
          throw new NotFoundException(
            `User with ID ${updatephenologydto.userId} not found`,
          );
        }
        phenology.user = user;
      }

      Object.assign(phenology, updatephenologydto);
      return await this.phenologiesRepo.save(phenology);
    } catch (error) {
      throw new BadRequestException(`Error updating phenology: ${error}`);
    }
  }

  async remove(id: string) {
    try {
      const phenology = await this.phenologiesRepo.findOne({ where: { id } });
      if (!phenology) {
        throw new NotFoundException(`Phenology with ID ${id} not found`);
      }

      await this.phenologiesRepo.remove(phenology);
      return `Phenology with ID ${id} removed successfully`;
    } catch (error) {
      throw new BadRequestException(`Error deleting phenology: ${error}`);
    }
  }
}
