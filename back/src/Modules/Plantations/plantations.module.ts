import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plantations } from './entities/plantations.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { PlantationsController } from './plantations.controller';
import { PlantationsService } from './plantations.service';
import { RecommendationsModule } from '../Recomendations/recomendations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plantations, Users]),
    RecommendationsModule,
  ],
  controllers: [PlantationsController],
  providers: [PlantationsService],
  exports: [PlantationsService],
})
export class PlantationsModule {}
