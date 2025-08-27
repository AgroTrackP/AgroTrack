import { ApplicationPlans } from 'src/Modules/ApplicationPlans/entities/applicationplan.entity';
// import { Recommendation } from 'src/Modules/Recomendations/entities/recomendations.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
    type: 'timestamp',
  })
  start_date: Date;
  @Column({
    type: 'varchar',
    nullable: false,
    default: 'verano',
  })
  season: string;

  @OneToMany(() => ApplicationPlans, (plan) => plan.plantation)
  applicationPlans: ApplicationPlans[];

  @ManyToOne(() => Users, (user) => user.plantations)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  // @ManyToOne(() => Recommendation)
  // @JoinColumn({ name: 'recommendation_id' })
  // recommendation: Recommendation;
}
