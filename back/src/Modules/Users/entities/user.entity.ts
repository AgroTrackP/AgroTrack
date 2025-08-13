import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../user.enum';
import { Plantations } from 'src/Modules/Plantations/entities/plantations.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';
import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { ApplicationPlans } from 'src/Modules/ApplicationPlans/entities/applicationplan.entity';
import { ApplicationType } from 'src/Modules/ApplicationTypes/entities/applicationtype.entity';
import { Phenology } from 'src/Modules/Phenologies/entities/phenologies.entity';

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

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  suscription_level: string;

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
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  profilePicture: string;
}
