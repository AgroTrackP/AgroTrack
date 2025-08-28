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
import { PhenologiesService } from './phenologies.service';
import { CreatePhenologyDto } from './dtos/create.phenology.dto';
import { UpdatePhenologyDto } from './dtos/update.phenology.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';
import { RoleGuard } from 'src/Guards/role.guard';
import { IsActiveGuard } from 'src/Guards/isActive.guard';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';

@ApiTags('Phenologies')
@Controller('phenologies')
export class PhenologiesController {
  constructor(private readonly phenologiesService: PhenologiesService) {}

  @Post()
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Crear una fenología' })
  @ApiBody({ type: CreatePhenologyDto })
  @ApiResponse({ status: 201, description: 'Fenología creada correctamente' })
  async create(@Body() createphenologydto: CreatePhenologyDto) {
    return this.phenologiesService.create(createphenologydto);
  }

  @Get()
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  @ApiOperation({ summary: 'Obtener todas las fenologías' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fenologías obtenida correctamente',
  })
  async findAll() {
    return this.phenologiesService.findAll();
  }

  @Get(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  @ApiOperation({ summary: 'Obtener una fenología por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la fenología (UUID)',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Fenología encontrada' })
  @ApiResponse({ status: 404, description: 'Fenología no encontrada' })
  async findOne(@Param('id') id: string) {
    return this.phenologiesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Actualizar una fenología por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la fenología (UUID)',
    type: String,
  })
  @ApiBody({ type: UpdatePhenologyDto })
  @ApiResponse({
    status: 200,
    description: 'Fenología actualizada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Fenología no encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updatephenologydto: UpdatePhenologyDto,
  ) {
    return this.phenologiesService.update(id, updatephenologydto);
  }

  @Delete(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una fenología por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la fenología (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Fenología eliminada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Fenología no encontrada' })
  async remove(@Param('id') id: string) {
    await this.phenologiesService.remove(id);
  }
}
