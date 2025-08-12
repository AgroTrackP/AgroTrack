import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { UsersModule } from '../Users/users.module';
import { Phenology } from './entities/phenologies.entity';
import { PhenologiesController } from './phenologies.controller';
import { PhenologiesService } from './phenologies.service';
@Module({
  imports: [TypeOrmModule.forFeature([Phenology, Users]), UsersModule],
  controllers: [PhenologiesController],
  providers: [PhenologiesService],
  exports: [PhenologiesService],
})
export class PhenologiesModule {}
