import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { CreateDiseaseDto } from './dtos/create.disease.dto';
import { UpdateDiseaseDto } from './dtos/update.disease.dto';
import { IsActiveGuard } from 'src/Guards/isActive.guard';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';

@ApiBearerAuth('jwt')
@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Get()
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  async findAll() {
    return this.diseasesService.findAll();
  }

  @Get(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  async findOne(@Param('id') id: string) {
    return this.diseasesService.findOne(id);
  }

  @Post()
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  async create(@Body() payload: CreateDiseaseDto) {
    return this.diseasesService.create(payload);
  }

  @Put(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() payload: UpdateDiseaseDto) {
    return this.diseasesService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.diseasesService.remove(id);
  }
}
