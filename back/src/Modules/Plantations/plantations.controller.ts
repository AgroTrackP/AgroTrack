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
import { PlantationsService } from './plantations.service';
import { CreatePlantationDto } from './dtos/create.plantation.dto';
import { UpdatePlantationDto } from './dtos/update.plantation.dto';

@Controller('plantations')
export class PlantationsController {
  constructor(private readonly plantationsService: PlantationsService) {}

  @Post()
  async create(@Body() payload: CreatePlantationDto) {
    return this.plantationsService.create(payload);
  }

  @Get()
  async findAll() {
    return this.plantationsService.findAll();
  }

  @Get('user/:id')
  async findByUser(@Param('id') userId: string) {
    return this.plantationsService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.plantationsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() payload: UpdatePlantationDto) {
    return this.plantationsService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.plantationsService.remove(id);
  }
}
