import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { Products } from './products.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('disease_product')
export class DiseaseProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Diseases)
  @JoinColumn({ name: 'disease_id' })
  disease: Diseases;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product: Products;
}
