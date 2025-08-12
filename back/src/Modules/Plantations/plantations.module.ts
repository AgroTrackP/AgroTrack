// src/Modules/Plantations/plantations.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plantations } from './entities/plantations.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { PlantationsController } from './plantations.controller';
import { PlantationsService } from './plantations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plantations, Users])],
  controllers: [PlantationsController],
  providers: [PlantationsService],
  exports: [PlantationsService],
})
export class PlantationsModule {}
