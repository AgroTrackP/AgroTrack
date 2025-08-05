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

  @Column({})
  crop_type: string;

  @Column({})
  location: string;

  @Column({})
  start_date: Date;
}
