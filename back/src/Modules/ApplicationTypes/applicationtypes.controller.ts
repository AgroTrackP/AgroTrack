import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ApplicationTypesService } from './applicationtypes.service';
import { CreateApplicationTypeDto } from './dtos/create.applicationtypes.dto';
import { UpdateApplicationTypeDto } from './dtos/update.applicationtypes.dto';
import { Request } from 'express';
import { Users } from '../Users/entities/user.entity';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { IsActiveGuard } from 'src/Guards/isActive.guard';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';

@ApiTags('Application Types')
@ApiBearerAuth()
@Controller('application-types')
export class ApplicationTypesController {
  constructor(private readonly appTypesService: ApplicationTypesService) {}

  @Post()
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new Application Type' })
  @ApiResponse({
    status: 201,
    description: 'Application Type created successfully.',
  })
  async create(
    @Body() createDto: CreateApplicationTypeDto,
    @Req() req: Request,
  ) {
    const user = req.user as Users;
    return this.appTypesService.create(createDto, user);
  }

  @Get()
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  @ApiOperation({ summary: 'Get all Application Types of the user' })
  @ApiResponse({
    status: 200,
    description: 'List of Application Types returned.',
  })
  async findAll(@Req() req: Request) {
    const user = req.user as Users;
    return this.appTypesService.findAll(user);
  }

  @Get(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  @ApiOperation({ summary: 'Get a single Application Type by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the Application Type' })
  @ApiResponse({ status: 200, description: 'Application Type found.' })
  @ApiResponse({ status: 404, description: 'Application Type not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as Users;
    return this.appTypesService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update an existing Application Type by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the Application Type' })
  @ApiResponse({
    status: 200,
    description: 'Application Type updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Application Type not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateApplicationTypeDto,
    @Req() req: Request,
  ) {
    const user = req.user as Users;
    return this.appTypesService.update(id, updateDto, user);
  }

  @Delete(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an Application Type by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the Application Type' })
  @ApiResponse({
    status: 204,
    description: 'Application Type deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Application Type not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as Users;
    await this.appTypesService.remove(id, user);
  }
}
