import { Users } from 'src/Modules/Users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('phenologies')
export class Phenology {
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
  })
  description: string;

  @ManyToOne(() => Users, (user) => user.phenologies)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
