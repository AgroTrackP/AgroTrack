import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseasesController } from './diseases.controller';
import { Products } from '../Products/entities/products.entity';
import { ProductsModule } from '../Products/products.module';
import { Users } from '../Users/entities/user.entity';
import { UsersModule } from '../Users/users.module';
import { DiseasesService } from './diseases.service';
import { Diseases } from './entities/diseases.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Diseases, Users, Products]),
    UsersModule,
    ProductsModule,
  ],
  controllers: [DiseasesController],
  providers: [DiseasesService],
  exports: [DiseasesService],
})
export class DiseasesModule {}
