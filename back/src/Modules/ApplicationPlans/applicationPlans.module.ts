import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationPlans } from './entities/applicationplan.entity';
import { ApplicationPlanItem } from './entities/applicationplan.item.entity';
import { Users } from '../Users/entities/user.entity';
import { Plantations } from '../Plantations/entities/plantations.entity';
import { Diseases } from '../Diseases/entities/diseases.entity';
import { ApplicationPlansController } from './applicationplans.controller';
import { DiseasesModule } from '../Diseases/diseases.module';
import { PlantationsModule } from '../Plantations/plantations.module';
import { ProductsModule } from '../Products/products.module';
import { UsersModule } from '../Users/users.module';
import { ApplicationPlansService } from './applicationplans.service';
import { Products } from '../Products/entities/products.entity';
import { RecommendationsModule } from '../Recomendations/recomendations.module';
import { TaskService } from '../task/task.service';
import { NodemailerModule } from '../nodemailer/mail.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApplicationPlans,
      Users,
      Plantations,
      Diseases,
      ApplicationPlanItem,
      Products,
    ]),
    UsersModule,
    forwardRef(() => PlantationsModule),
    DiseasesModule,
    ProductsModule,
    RecommendationsModule,
    NodemailerModule,
  ],
  controllers: [ApplicationPlansController],
  providers: [ApplicationPlansService, TaskService],
  exports: [ApplicationPlansService, TaskService],
})
export class ApplicationPlansModule {}
