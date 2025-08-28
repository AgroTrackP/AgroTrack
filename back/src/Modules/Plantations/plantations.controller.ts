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
  Patch,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PlantationsService } from './plantations.service';
import { CreatePlantationDto } from './dtos/create.plantation.dto';
import { UpdatePlantationDto } from './dtos/update.plantation.dto';
import { QueryPlantationsDto } from './dtos/pagination.dto';
import { PlantationOwnerGuard } from 'src/Guards/plantation-owner.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { IsActiveGuard } from 'src/Guards/isActive.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';
import { SelfOnlyGuard } from 'src/Guards/selfOnly.guard';

@ApiTags('Plantations')
@ApiBearerAuth('jwt')
@Controller('plantations')
export class PlantationsController {
  constructor(private readonly plantationsService: PlantationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva plantación' })
  @ApiResponse({ status: 201, description: 'Plantación creada con éxito' })
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  async create(@Body() payload: CreatePlantationDto) {
    return this.plantationsService.create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las plantaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de plantaciones obtenida con éxito',
  })
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  async findAll() {
    return this.plantationsService.findAll();
  }

  @Get('paginated')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener plantaciones paginadas' })
  @ApiResponse({ status: 200, description: 'Lista paginada de plantaciones' })
  async findAllPaginated(@Query() queryDto: QueryPlantationsDto) {
    return this.plantationsService.findAllPaginated(queryDto);
  }

  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, SelfOnlyGuard)
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

  @Get(':id/weather')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, PlantationOwnerGuard)
  @ApiOperation({ summary: 'Get current weather for a specific plantation' })
  @ApiResponse({
    status: 200,
    description: 'Current weather data retrieved successfully',
    example: {
      locationName: 'Cartagena',
      temperature: '15.16°C',
      feelsLike: '14.72°C',
      humidity: '76%',
      description: 'muy nuboso',
      windSpeed: '1.65 m/s',
      icon: 'https://openweathermap.org/img/wn/04d@2x.png',
    },
  })
  @ApiResponse({ status: 404, description: 'Plantation not found' })
  async getWeatherForPlantation(@Param('id', ParseUUIDPipe) id: string) {
    return await this.plantationsService.getWeatherForPlantation(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una plantación por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la plantación' })
  @ApiResponse({ status: 200, description: 'Plantación encontrada' })
  @ApiResponse({ status: 404, description: 'Plantación no encontrada' })
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, PlantationOwnerGuard)
  async findOne(@Param('id') id: string) {
    return this.plantationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una plantación por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la plantación' })
  @ApiResponse({ status: 200, description: 'Plantación actualizada con éxito' })
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, PlantationOwnerGuard)
  async update(@Param('id') id: string, @Body() payload: UpdatePlantationDto) {
    return this.plantationsService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una plantación por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la plantación' })
  @ApiResponse({ status: 204, description: 'Plantación eliminada con éxito' })
  async remove(@Param('id') id: string) {
    await this.plantationsService.remove(id);
  }

  @Patch(':id/activate')
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Activates a plantation (Admin only)' })
  async activatePlantation(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantationsService.setActivationStatus(id, true);
  }

  @Patch(':id/deactivate')
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: 'Deactivates a plantation (Admin only)' })
  async deactivatePlantation(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantationsService.setActivationStatus(id, false);
  }
}
