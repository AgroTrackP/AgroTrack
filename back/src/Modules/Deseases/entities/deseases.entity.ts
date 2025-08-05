import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'DISEASES',
})
export class Diseases {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'text',
  })
  description: string;
}
