import { ApplicationPlans } from 'src/Modules/ApplicationPlans/entities/applicationplan.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToOne(() => Users, (user) => user.diseases)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => ApplicationPlans, (plan) => plan.disease)
  applicationPlans: ApplicationPlans[];

  @ManyToMany(() => Products, (product) => product.diseases)
  @JoinTable({
    name: 'disease_product',
    joinColumn: { name: 'disease_id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  products: Products[];
}
