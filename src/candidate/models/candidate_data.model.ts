import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { User } from '../../user/models/user.model';
import { DailyJobUpdate } from '../../experience/models/daily.job.update.model';
import { YearsExperience } from '../../experience/models/years.experience.model';
import { HospitalityEstablishment } from 'src/experience/models/hospitality_establishment.model';
import { HospitalityRole } from 'src/experience/models/hospitality_role.model';
import { ConstructionRole } from 'src/experience/models/construction_role.model';
import { ConstructionCardType } from 'src/experience/models/construction_card_type.model';
import { Sector } from 'src/experience/models/sector.model';

interface CandidateDataAttribute {
  sector_id: string;
  hospitality_first_role_id: string;
  hospitality_second_role_id: string;
  hospitality_main_establishment_id: string;
  hospitality_second_establishment_id: string;
  construction_role_id: string;
  construction_card_type_id: string;
  years_experience_id: string;
  daily_job_update_id: string;
  agreement_to_contact: boolean;
  verified: boolean;
  user_id: string;
}

@Table({ tableName: 'candidate_data' })
export class CandidateData extends Model<
  CandidateData,
  CandidateDataAttribute
> {
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
  hospitality_first_role_id: string;

  @ForeignKey(() => HospitalityRole)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  hospitality_second_role_id: string;

  @ForeignKey(() => HospitalityEstablishment)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  hospitality_main_establishment_id: string;

  @ForeignKey(() => HospitalityEstablishment)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  hospitality_second_establishment_id: string;

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

  @ForeignKey(() => DailyJobUpdate)
  @Column({
    type: DataType.UUID,
  })
  daily_job_update_id: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  agreement_to_contact: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  verified: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  user_id: string;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @BelongsTo(() => DailyJobUpdate, 'daily_job_update_id')
  daily_job_update: DailyJobUpdate;

  @BelongsTo(() => YearsExperience, 'years_experience_id')
  years_experience: YearsExperience;

  @BelongsTo(() => Sector, 'sector_id')
  sector: Sector;

  @BelongsTo(() => HospitalityRole, 'hospitality_first_role_id')
  hospitality_first_role: HospitalityRole;

  @BelongsTo(() => HospitalityRole, 'hospitality_second_role_id')
  hospitality_second_role: HospitalityRole;

  @BelongsTo(
    () => HospitalityEstablishment,
    'hospitality_main_establishment_id',
  )
  hospitality_main_establishment: HospitalityEstablishment;

  @BelongsTo(
    () => HospitalityEstablishment,
    'hospitality_second_establishment_id',
  )
  hospitality_second_establishment: HospitalityEstablishment;

  @BelongsTo(() => ConstructionRole, 'construction_role_id')
  construction_role: ConstructionRole;

  @BelongsTo(() => ConstructionCardType, 'construction_card_type_id')
  construction_card_type: ConstructionCardType;

  // After fetching the data, we transform the skills to stay in the CandidateData as array of IDs.
  skills?: string[];
}
