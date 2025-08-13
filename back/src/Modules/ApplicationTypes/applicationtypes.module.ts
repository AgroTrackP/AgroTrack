import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { UsersModule } from '../Users/users.module';
import { ApplicationType } from './entities/applicationtype.entity';
import { ApplicationTypesController } from './applicationtypes.controller';
import { ApplicationTypesService } from './applicationtypes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationType, Users]), UsersModule],
  controllers: [ApplicationTypesController],
  providers: [ApplicationTypesService],
  exports: [ApplicationTypesService],
})
export class ApplicationTypesModule {}
