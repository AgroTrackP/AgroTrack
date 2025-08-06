import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { ApplicationPlans } from './applicationplan.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';

@Entity('application_plan_items')
export class ApplicationPlanItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
  })
  dosage_per_m2: number;

  @Column({
    type: 'decimal',
  })
  calculated_quantity: number;

  @ManyToOne(() => ApplicationPlans, (plan) => plan.items)
  @JoinColumn({ name: 'application_plan_id' })
  applicationPlan: ApplicationPlans;

  @ManyToOne(() => Products, (product) => product.applicationPlanItems)
  @JoinColumn({ name: 'product_id' })
  product: Products;
}
