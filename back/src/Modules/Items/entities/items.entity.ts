import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
//entidad item
@Entity({
  name: 'ITEMS',
})
export class Items {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'decimal',
  })
  concentration: number;

  @Column({
    type: 'decimal',
  })
  water_per_liter: number;

  @Column({
    type: 'decimal',
  })
  stock: number;

  @Column({
    type: 'decimal',
  })
  alert_threshold: number;
}
