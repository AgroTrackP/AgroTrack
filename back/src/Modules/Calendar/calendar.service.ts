import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEntry } from './entities/calendar.entity';
import { Users } from '../Users/entities/user.entity';
import { CreateCalendarEntryDto } from './dto/update.calendar.dto';
import { UpdateCalendarEntryDto } from './dto/create.calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntry)
    private calendarRepository: Repository<CalendarEntry>,
  ) {}

  /**
   * Crea un nuevo registro de calendario para el usuario.
   * @param createDto Los datos del registro.
   * @param user El usuario autenticado.
   * @returns El registro de calendario creado.
   */
  async create(
    createDto: CreateCalendarEntryDto,
    user: Users,
  ): Promise<CalendarEntry> {
    const calendarEntry = this.calendarRepository.create({
      ...createDto,
      user,
    });
    return this.calendarRepository.save(calendarEntry);
  }

  /**
   * Obtiene todos los registros de calendario del usuario.
   * @param user El usuario autenticado.
   * @returns Una lista de registros de calendario.
   */
  async findAll(user: Users): Promise<CalendarEntry[]> {
    return this.calendarRepository.find({
      where: { user: { id: user.id } },
    });
  }

  /**
   * Busca un registro de calendario por su ID para un usuario específico.
   * @param id El ID del registro.
   * @param user El usuario autenticado.
   * @returns El registro de calendario.
   * @throws NotFoundException si el registro no existe o no pertenece al usuario.
   */
  async findOne(id: string, user: Users): Promise<CalendarEntry> {
    const calendarEntry = await this.calendarRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!calendarEntry) {
      throw new NotFoundException(
        `Calendar entry with ID ${id} not found or does not belong to the user.`,
      );
    }

    return calendarEntry;
  }

  /**
   * Actualiza un registro de calendario existente.
   * @param id El ID del registro.
   * @param updateDto Los datos para actualizar.
   * @param user El usuario autenticado.
   * @returns El registro actualizado.
   */
  async update(
    id: string,
    updateDto: UpdateCalendarEntryDto,
    user: Users,
  ): Promise<CalendarEntry> {
    const calendarEntry = await this.findOne(id, user);
    Object.assign(calendarEntry, updateDto);
    return this.calendarRepository.save(calendarEntry);
  }

  /**
   * Elimina un registro de calendario.
   * @param id El ID del registro a eliminar.
   * @param user El usuario autenticado.
   */
  async remove(id: string, user: Users): Promise<void> {
    const calendarEntry = await this.findOne(id, user);
    await this.calendarRepository.remove(calendarEntry);
  }
}
