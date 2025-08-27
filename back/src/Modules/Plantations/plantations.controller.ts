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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PlantationsService } from './plantations.service';
import { CreatePlantationDto } from './dtos/create.plantation.dto';
import { UpdatePlantationDto } from './dtos/update.plantation.dto';
import { QueryPlantationsDto } from './dtos/pagination.dto';

@ApiTags('Plantations')
@Controller('plantations')
export class PlantationsController {
  constructor(private readonly plantationsService: PlantationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva plantación' })
  @ApiResponse({ status: 201, description: 'Plantación creada con éxito' })
  async create(@Body() payload: CreatePlantationDto) {
    return this.plantationsService.create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las plantaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de plantaciones obtenida con éxito',
  })
  async findAll() {
    return this.plantationsService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Obtener plantaciones paginadas' })
  @ApiResponse({ status: 200, description: 'Lista paginada de plantaciones' })
  async findAllPaginated(@Query() queryDto: QueryPlantationsDto) {
    return this.plantationsService.findAllPaginated(queryDto);
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Obtener plantaciones de un usuario con paginación',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID del usuario' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Límite de registros por página',
    example: 5,
  })
  async findByUser(
    @Param('id') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 5,
  ) {
    return this.plantationsService.findByUser(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una plantación por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la plantación' })
  @ApiResponse({ status: 200, description: 'Plantación encontrada' })
  @ApiResponse({ status: 404, description: 'Plantación no encontrada' })
  async findOne(@Param('id') id: string) {
    return this.plantationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una plantación por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la plantación' })
  @ApiResponse({ status: 200, description: 'Plantación actualizada con éxito' })
  async update(@Param('id') id: string, @Body() payload: UpdatePlantationDto) {
    return this.plantationsService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una plantación por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la plantación' })
  @ApiResponse({ status: 204, description: 'Plantación eliminada con éxito' })
  async remove(@Param('id') id: string) {
    await this.plantationsService.remove(id);
  }
}
