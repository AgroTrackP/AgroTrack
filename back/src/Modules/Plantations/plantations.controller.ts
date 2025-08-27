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
import { PlantationsService } from './plantations.service';
import { CreatePlantationDto } from './dtos/create.plantation.dto';
import { UpdatePlantationDto } from './dtos/update.plantation.dto';
import { QueryPlantationsDto } from './dtos/pagination.dto';
import { Roles } from '../Auth/decorators/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Role } from '../Users/user.enum';
import { SelfOnlyGuard } from 'src/Guards/selfOnly.guard';

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
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get all plantations with pagination, filtering, and sorting',
  })
  async findAllPaginated(@Query() queryDto: QueryPlantationsDto) {
    return this.plantationsService.findAllPaginated(queryDto);
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
  // En plantations.controller.ts

  @Patch(':id/activate')
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Activates a plantation (Admin only)' })
  async activatePlantation(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantationsService.setActivationStatus(id, true);
  }

  @Patch(':id/deactivate')
  @UseGuards(PassportJwtAuthGuard, SelfOnlyGuard)
  @ApiOperation({ summary: 'Deactivates a plantation (Admin only)' })
  async deactivatePlantation(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantationsService.setActivationStatus(id, false);
  }
}
