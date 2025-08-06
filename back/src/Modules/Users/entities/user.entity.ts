import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../user.enum';

@Entity({
  name: 'USERS',
})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'user',
  })
  role: Role;

  @Column({
    type: 'timestamp',
  })
  created_at: Date;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  suscription_level: string;
}
