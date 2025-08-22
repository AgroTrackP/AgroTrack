import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plantations } from './entities/plantations.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { PlantationsController } from './plantations.controller';
import { PlantationsService } from './plantations.service';
import { RecommendationsModule } from '../Recomendations/recomendations.module';
import { ActivityLogsModule } from '../ActivityLogs/activity-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plantations, Users]),
    RecommendationsModule,
    ActivityLogsModule,
  ],
  controllers: [PlantationsController],
  providers: [PlantationsService],
  exports: [PlantationsService],
})
export class PlantationsModule {}
