import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from './entities/recomendations.entity';
import { RecommendationsService } from './recomendations.service';
import { RecommendationsController } from './recomendations.controller';
import { DiseasesModule } from 'src/Modules/Diseases/diseases.module';
import { ProductsModule } from 'src/Modules/Products/products.module';
import { PhenologiesModule } from 'src/Modules/Phenologies/phenologies.module';
import { ApplicationTypesModule } from '../ApplicationTypes/applicationtypes.module';
import { ApplicationPlansModule } from '../ApplicationPlans/applicationPlans.module';
import { UsersModule } from 'src/Modules/Users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recommendation]),
    DiseasesModule,
    ProductsModule,
    PhenologiesModule,
    ApplicationTypesModule,
    forwardRef(() => ApplicationPlansModule),
    UsersModule,
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
