import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { Plantations } from 'src/Modules/Plantations/entities/plantations.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationPlanItem } from './applicationplan.item.entity';
import { Status } from '../status.enum';

@Entity({
  name: 'APPLICATION_PLANS',
})
export class ApplicationPlans {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'date',
  })
  planned_date: Date;

  @Column({
    type: 'decimal',
  })
  total_water: number;

  @Column({
    type: 'decimal',
  })
  total_product: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ManyToOne(() => Users, (user) => user.applicationPlans)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Plantations, (plantation) => plantation.applicationPlans)
  @JoinColumn({ name: 'plantation_id' })
  plantation: Plantations;

  @ManyToOne(() => Diseases, (disease) => disease.applicationPlans)
  @JoinColumn({ name: 'disease_id' })
  disease: Diseases;

  @OneToMany(() => ApplicationPlanItem, (item) => item.applicationPlan)
  items: ApplicationPlanItem[];
}
