import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Req, // Importa el decorador Req
} from '@nestjs/common';
import { Request } from 'express'; // Importa el tipo Request
import { CalendarService } from './calendar.service';
import { CreateCalendarEntryDto } from './dto/update.calendar.dto';
import { UpdateCalendarEntryDto } from './dto/create.calendar.dto';
import { Users } from '../Users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Calendar')
@ApiBearerAuth()
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calendar entry' })
  @ApiResponse({
    status: 201,
    description: 'Calendar entry created successfully.',
  })
  async create(
    @Body() createDto: CreateCalendarEntryDto,
    @Req() req: Request, // Usa el decorador @Req() para obtener la solicitud
  ) {
    const user = req.user as Users; // Accede al usuario y le das el tipo
    return this.calendarService.create(createDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all calendar entries for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of calendar entries returned.',
  })
  async findAll(@Req() req: Request) {
    const user = req.user as Users;
    return this.calendarService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single calendar entry by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the calendar entry' })
  @ApiResponse({ status: 200, description: 'Calendar entry found.' })
  @ApiResponse({ status: 404, description: 'Calendar entry not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as Users;
    return this.calendarService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing calendar entry by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the calendar entry' })
  @ApiResponse({
    status: 200,
    description: 'Calendar entry updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Calendar entry not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCalendarEntryDto,
    @Req() req: Request,
  ) {
    const user = req.user as Users;
    return this.calendarService.update(id, updateDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a calendar entry by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the calendar entry' })
  @ApiResponse({
    status: 204,
    description: 'Calendar entry deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Calendar entry not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as Users;
    await this.calendarService.remove(id, user);
  }
}
