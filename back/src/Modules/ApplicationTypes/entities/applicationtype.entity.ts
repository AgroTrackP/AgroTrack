import { Users } from 'src/Modules/Users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity('application_types')
export class ApplicationType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @ManyToOne(() => Users, (user) => user.applicationTypes)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
