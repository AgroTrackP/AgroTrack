import { ApplicationPlanItem } from 'src/Modules/ApplicationPlans/entities/applicationplan.item.entity';
import { Categories } from 'src/Modules/Categories/entities/categories.entity';
import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'PRODUCTS',
})
export class Products {
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

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => Users, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => ApplicationPlanItem, (item) => item.product)
  applicationPlanItems: ApplicationPlanItem[];

  @ManyToMany(() => Diseases, (disease) => disease.products)
  diseases: Diseases[];

  @ManyToOne(() => Categories, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Categories;
}
