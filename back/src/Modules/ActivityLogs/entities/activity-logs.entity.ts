import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../Users/entities/user.entity';

export enum ActivityType {
  USER_LOGIN = 'USER_LOGIN',
  USER_REGISTER = 'USER_REGISTER',
  USER_IMG_UPDATED = 'USER_IMG_UPDATED',
  USER_INFO_UPDATED = 'USER_INFO_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_INNACTIVE = 'USER_INNACTIVE',
  PLANTATION_CREATED = 'PLANTATION_CREATED',
  PLANTATION_UPDATED = 'PLANTATION_UPDATED',
  SUBSCRIPTION_STARTED = 'SUBSCRIPTION_STARTED',
  SUBSCRIPTION_CANCELED = 'SUBSCRIPTION_CANCELED',
}

@Entity('activity-logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column()
  description: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Users, (user) => user.activityLogs)
  @JoinColumn({ name: 'user-id' })
  user: Users;
}
