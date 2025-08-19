import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Users } from 'src/Modules/Users/entities/user.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string; // Básico, Pro, Premium

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  maxUsers: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  maxDevices: number;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  features: string[]; // ["Feature 1", "Feature 2"]

  @OneToMany(() => Users, (user) => user.suscription_level)
  users: Users[];

  @Column({
    unique: true,
    nullable: false, // Cada plan en la DB debe tener su price_id de Stripe.
  })
  stripePriceId: string;
}
