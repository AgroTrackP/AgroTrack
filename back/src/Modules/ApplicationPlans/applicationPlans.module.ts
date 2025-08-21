import { Module } from '@nestjs/common';
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
    PlantationsModule,
    DiseasesModule,
    ProductsModule,
  ],
  controllers: [ApplicationPlansController],
  providers: [ApplicationPlansService],
  exports: [ApplicationPlansService],
})
export class ApplicationPlansModule {}
