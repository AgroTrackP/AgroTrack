import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'PLANTATIONS',
})
export class Plantations {
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
    type: 'decimal',
  })
  area_m2: number;

  @Column({
    type: 'varchar',
  })
  crop_type: string;

  @Column({
    type: 'varchar',
  })
  location: string;

  @Column({
    type: 'datetime',
  })
  start_date: Date;
}
