import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';
import { ApplicationType } from 'src/Modules/ApplicationTypes/entities/applicationtype.entity';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  crop_type: string; // "Tomate", "Lechuga", etc.

  @Column({ type: 'text', nullable: true })
  planting_notes: string; // notas sobre fechas, temperatura, clima, etc.

  @Column({ type: 'decimal', nullable: true })
  recommended_water_per_m2: number; // litros/m2

  @Column({ type: 'text', nullable: true })
  recommended_fertilizer: string;

  @Column({ type: 'text', nullable: true })
  additional_notes: string; // observaciones extra

  @ManyToMany(() => Diseases)
  @JoinTable({
    name: 'recommendation_diseases',
    joinColumn: { name: 'recommendation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'disease_id', referencedColumnName: 'id' },
  })
  recommended_diseases: Diseases[];

  @ManyToMany(() => Products)
  @JoinTable({
    name: 'recommendation_products',
    joinColumn: { name: 'recommendation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  recommended_products: Products[];

  @ManyToOne(() => ApplicationType)
  @JoinColumn({ name: 'recommended_application_type_id' })
  recommended_application_type: ApplicationType; // Preventiva, Curativa, Fertilizante, etc.
}
