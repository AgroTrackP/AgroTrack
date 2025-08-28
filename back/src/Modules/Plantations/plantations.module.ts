import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plantations } from './entities/plantations.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { PlantationsController } from './plantations.controller';
import { PlantationsService } from './plantations.service';
import { ActivityLogsModule } from '../ActivityLogs/activity-logs.module';
import { ApplicationPlansModule } from '../ApplicationPlans/applicationPlans.module';
import { RecommendationsModule } from '../Recomendations/recomendations.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plantations, Users]),
    ActivityLogsModule,
    forwardRef(() => ApplicationPlansModule),
    RecommendationsModule,
    HttpModule,
  ],
  controllers: [PlantationsController],
  providers: [PlantationsService],
  exports: [PlantationsService],
})
export class PlantationsModule {}
