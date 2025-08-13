import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApplicationPlansService } from './applicationplans.service';
import { CreateApplicationPlanDto } from './dtos/create.applicationplan.dto';
import { UpdateApplicationPlanDto } from './dtos/update.applicationplan.dto';
import { ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ApplicationPlans } from './entities/applicationplan.entity';

@ApiTags('planes-de-aplicacion')
@Controller('planes-de-aplicacion')
export class ApplicationPlansController {
  constructor(private readonly appPlansService: ApplicationPlansService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listado de planes de aplicación',
    type: [ApplicationPlans],
  })
  async findAll(): Promise<ApplicationPlans[]> {
    return this.appPlansService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID UUID del plan de aplicación' })
  @ApiResponse({
    status: 200,
    description: 'Plan de aplicación encontrado por ID',
    type: ApplicationPlans,
  })
  @ApiResponse({ status: 404, description: 'Plan de aplicación no encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApplicationPlans> {
    return this.appPlansService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBody({
    type: CreateApplicationPlanDto,
    description: 'Datos para crear un nuevo plan de aplicación',
  })
  @ApiResponse({
    status: 201,
    description: 'Plan de aplicación creado exitosamente',
    type: ApplicationPlans,
  })
  async create(
    @Body() createDto: CreateApplicationPlanDto,
  ): Promise<ApplicationPlans> {
    return this.appPlansService.create(createDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiParam({
    name: 'id',
    description: 'ID UUID del plan de aplicación a actualizar',
  })
  @ApiBody({
    type: UpdateApplicationPlanDto,
    description: 'Datos para actualizar el plan de aplicación',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de aplicación actualizado exitosamente',
    type: ApplicationPlans,
  })
  @ApiResponse({ status: 404, description: 'Plan de aplicación no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateApplicationPlanDto,
  ): Promise<ApplicationPlans> {
    return this.appPlansService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID UUID del plan de aplicación a eliminar',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Plan de aplicación eliminado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Plan de aplicación no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.appPlansService.remove(id);
  }
}
