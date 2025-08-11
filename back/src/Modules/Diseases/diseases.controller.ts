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
} from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { CreateDiseaseDto } from './dtos/create.disease.dto';
import { UpdateDiseaseDto } from './dtos/update.disease.dto';

@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Get()
  async findAll() {
    return this.diseasesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.diseasesService.findOne(id);
  }

  @Post()
  async create(@Body() payload: CreateDiseaseDto) {
    return this.diseasesService.create(payload);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateDiseaseDto) {
    return this.diseasesService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.diseasesService.remove(id);
  }
}
