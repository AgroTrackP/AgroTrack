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
  Query,
  // Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationPlansService } from './applicationplans.service';
import { CreateApplicationPlanDto } from './dtos/create.applicationplan.dto';
import { UpdateApplicationPlanDto } from './dtos/update.applicationplan.dto';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApplicationPlans } from './entities/applicationplan.entity';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
// import { Users } from '../Users/entities/user.entity';
import { FindPendingPlansDto } from './dtos/pagination.dto';
// import { Request } from 'express';
import { SelfOnlyGuard } from 'src/Guards/selfOnly.guard';
import { IsActiveGuard } from 'src/Guards/isActive.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';

@ApiBearerAuth('jwt')
@ApiTags('planes-de-aplicacion')
@ApiBearerAuth('jwt')
@Controller('planes-de-aplicacion')
export class ApplicationPlansController {
  constructor(private readonly appPlansService: ApplicationPlansService) {}

  @Get('pending/:userId')
  @UseGuards(PassportJwtAuthGuard, SelfOnlyGuard) // Usar el guard para proteger la ruta
  @ApiOperation({
    summary:
      'Obtener planes de aplicación pendientes para un usuario por un rango de fechas o para mañana por defecto.',
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario', type: 'string' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @ApiResponse({ status: 200, description: 'Lista de planes pendientes' })
  async getPendingPlansForUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: FindPendingPlansDto,
  ) {
    return this.appPlansService.findPendingPlans(
      userId,
      query.startDate,
      query.endDate,
    );
  }

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
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
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
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
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
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
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
