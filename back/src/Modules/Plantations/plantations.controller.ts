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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PlantationsService } from './plantations.service';
import { CreatePlantationDto } from './dtos/create.plantation.dto';
import { UpdatePlantationDto } from './dtos/update.plantation.dto';
import { QueryPlantationsDto } from './dtos/pagination.dto';

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

  // En tu plantations.controller.ts

  @Get('paginated')
  async findAllPaginated(
    @Query() queryDto: QueryPlantationsDto, // <-- Usa el nuevo DTO unificado
  ) {
    return this.plantationsService.findAllPaginated(queryDto); // <-- Pasa el DTO completo al servicio
  }
  @Get('user/:id')
  async findByUser(
    @Param('id') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 5,
  ) {
    return this.plantationsService.findByUser(userId, page, limit);
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
