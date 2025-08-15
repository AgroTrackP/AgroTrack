import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationType } from './entities/applicationtype.entity';
import { CreateApplicationTypeDto } from './dtos/create.applicationtypes.dto';
import { UpdateApplicationTypeDto } from './dtos/update.applicationtypes.dto';
import { Users } from 'src/Modules/Users/entities/user.entity';

@Injectable()
export class ApplicationTypesService {
  constructor(
    @InjectRepository(ApplicationType)
    private readonly appTypeRepo: Repository<ApplicationType>,
  ) {}

  async create(
    createDto: CreateApplicationTypeDto,
    user: Users,
  ): Promise<ApplicationType> {
    const appType = this.appTypeRepo.create({ ...createDto, user });
    return await this.appTypeRepo.save(appType);
  }

  async findAll(user: Users): Promise<ApplicationType[]> {
    return this.appTypeRepo.find({
      where: { user: { id: user.id } },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, user: Users): Promise<ApplicationType> {
    const appType = await this.appTypeRepo.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!appType) {
      throw new NotFoundException(`ApplicationType with id ${id} not found`);
    }
    return appType;
  }

  async update(
    id: string,
    updateDto: UpdateApplicationTypeDto,
    user: Users,
  ): Promise<ApplicationType> {
    const appType = await this.findOne(id, user);
    Object.assign(appType, updateDto);
    return this.appTypeRepo.save(appType);
  }

  async remove(id: string, user: Users): Promise<void> {
    const appType = await this.findOne(id, user);
    await this.appTypeRepo.remove(appType);
  }
}
