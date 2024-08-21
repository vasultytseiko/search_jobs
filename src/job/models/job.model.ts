import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';

import { YearsExperience } from '../../experience/models/years.experience.model';
import { HospitalityRole } from 'src/experience/models/hospitality_role.model';
import { User } from 'src/user/models/user.model';
import { JobApplication } from './job_application.model';
import { HospitalityEstablishment } from 'src/experience/models/hospitality_establishment.model';
import { ConstructionRole } from 'src/experience/models/construction_role.model';
import { ConstructionCardType } from 'src/experience/models/construction_card_type.model';
import { Sector } from 'src/experience/models/sector.model';

interface JobAttribute {
  sector_id: string;
  hospitality_role_id: string;
  hospitality_establishment_id: string;
  construction_role_id: string;
  construction_card_type_id: string;
  years_experience_id: string;
  employment_type: string;
  location: string;
  rate_of_pay: number;
  postcode: string;
  distance: number;
  status: string;
  verified: boolean;
  user_id: string;
}

@Table({ tableName: 'job' })
export class Job extends Model<Job, JobAttribute> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Sector)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  sector_id: string;

  @ForeignKey(() => HospitalityRole)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  hospitality_role_id: string;

  @ForeignKey(() => HospitalityEstablishment)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  hospitality_establishment_id: string;

  @ForeignKey(() => ConstructionRole)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  construction_role_id: string;

  @ForeignKey(() => ConstructionCardType)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  construction_card_type_id: string;

  @ForeignKey(() => YearsExperience)
  @Column({
    type: DataType.UUID,
  })
  years_experience_id: string;

  @Column({
    type: DataType.STRING,
  })
  employment_type: string;

  @Column({
    type: DataType.STRING,
  })
  location: string;

  @Column({
    type: DataType.INTEGER,
  })
  rate_of_pay: number;

  @Column({
    type: DataType.STRING,
  })
  postcode: string;

  @Column({
    type: DataType.INTEGER,
  })
  distance: number;

  @Column({
    type: DataType.STRING,
  })
  status: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  verified: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  user_id: string;

  @BelongsTo(() => YearsExperience)
  years_experience: YearsExperience;

  @BelongsTo(() => Sector)
  sector: Sector;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => HospitalityRole)
  hospitality_role: HospitalityRole;

  @BelongsTo(() => HospitalityEstablishment)
  hospitality_establishment: HospitalityEstablishment;

  @BelongsTo(() => ConstructionRole)
  construction_role: ConstructionRole;

  @BelongsTo(() => ConstructionCardType)
  construction_card_type: ConstructionCardType;

  @HasMany(() => JobApplication, 'job_id')
  job_application: JobApplication[];
}
