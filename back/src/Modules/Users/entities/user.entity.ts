import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  BeforeUpdate,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../user.enum';
import { Plantations } from 'src/Modules/Plantations/entities/plantations.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';
import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { ApplicationPlans } from 'src/Modules/ApplicationPlans/entities/applicationplan.entity';
import { ApplicationType } from 'src/Modules/ApplicationTypes/entities/applicationtype.entity';
import { Phenology } from 'src/Modules/Phenologies/entities/phenologies.entity';
import { SubscriptionPlan } from 'src/Modules/SubscriptionPlan/entities/subscriptionplan.entity';
import { SubscriptionStatus } from '../subscriptionStatus.enum';
import { ActivityLog } from 'src/Modules/ActivityLogs/entities/activity-logs.entity';
import { CalendarEntry } from 'src/Modules/Calendar/entities/calendar.entity';

@Entity({
  name: 'USERS',
})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: Role.User,
    enum: Role,
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ManyToOne(() => SubscriptionPlan, (suscriptionPlan) => suscriptionPlan.users)
  @JoinColumn({ name: 'subscription_plan_id' })
  suscription_level: SubscriptionPlan | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  isConfirmed: boolean;

  @OneToMany(() => Plantations, (plantation) => plantation.user)
  plantations: Plantations[];

  @OneToMany(() => Products, (product) => product.user)
  products: Products[];

  @OneToMany(() => Diseases, (disease) => disease.user)
  diseases: Diseases[];

  @OneToMany(() => ApplicationPlans, (plan) => plan.user)
  applicationPlans: ApplicationPlans[];

  @OneToMany(() => ApplicationType, (type) => type.user)
  applicationTypes: ApplicationType[];

  @OneToMany(() => Phenology, (phenology) => phenology.user)
  phenologies: Phenology[];

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({ unique: true, nullable: true })
  auth0Id: string;

  @Column({
    nullable: true,
    default:
      'https://res.cloudinary.com/dbemhu1mr/image/upload/v1755097246/icon-7797704_640_t4vlks.png',
  })
  imgUrl: string;

  @BeforeInsert()
  @BeforeUpdate()
  setDefaultImgUrl() {
    if (!this.imgUrl || this.imgUrl.trim() === '') {
      this.imgUrl =
        'https://res.cloudinary.com/dbemhu1mr/image/upload/v1755097246/icon-7797704_640_t4vlks.png';
    }
  }
  @Column({ nullable: true, default: 'icon-7797704_640_t4vlks' })
  imgPublicId: string;

  @BeforeInsert()
  @BeforeUpdate()
  setDefaultImgPublicId() {
    if (!this.imgPublicId || this.imgPublicId.trim() === '') {
      this.imgPublicId = 'icon-7797704_640_t4vlks';
    }
  }

  @Column({ unique: true, nullable: true })
  stripeCustomerId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.NONE,
  })
  subscriptionStatus: SubscriptionStatus;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
  activityLogs: ActivityLog[];

  @OneToMany(() => CalendarEntry, (calendarEntry) => calendarEntry.user)
  calendarEntries: CalendarEntry[];
}
