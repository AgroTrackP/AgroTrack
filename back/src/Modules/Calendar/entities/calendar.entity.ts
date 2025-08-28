import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Users } from 'src/Modules/Users/entities/user.entity';
@Entity()
export class CalendarEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'date' })
  nextActionDate: Date;

  @Column()
  actionType: string; // 'riego', 'aplicacion_producto', etc.

  @ManyToOne(() => Users, (user) => user.calendarEntries)
  user: Users; // Relación con la entidad de usuario
}
