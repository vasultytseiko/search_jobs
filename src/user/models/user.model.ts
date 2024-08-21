import {
  Column,
  DataType,
  Model,
  Table,
  HasOne,
  HasMany,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';

import { Role } from '../../role/models/role.model';

import { RecruiterData } from '../../recruiter/models/recruiter.data.model';
import { CandidateData } from '../../candidate/models/candidate_data.model';
import { Job } from 'src/job/models/job.model';
import { JobApplication } from 'src/job/models/job_application.model';
import { SmsCampaign } from 'src/sms.campaign/models/sms_campaign.model';
import { AuthUser } from 'src/auth/model/auth_user.model';
import { Billing } from 'src/payment/models/billing.model';
import { Skill } from 'src/experience/models/skill.model';
import { CandidateSkill } from '../../candidate/models/candidate_skill.model';
import { CandidateVerification } from 'src/candidate/models/candidate_verification.model';

interface UserCreationAttribute {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  photo: string;
  postcode: string;
  postcode_latitude: number;
  postcode_longitude: number;
  role_id: string;
  auth_user_id: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttribute> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  postcode: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  postcode_latitude: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  postcode_longitude: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  photo: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  role_id: string;

  @ForeignKey(() => AuthUser)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  auth_user_id: string;

  @BelongsTo(() => AuthUser)
  auth_user: AuthUser;

  @BelongsTo(() => Role)
  role: Role;

  @HasOne(() => CandidateData, 'user_id')
  candidate_data: CandidateData;

  @HasOne(() => RecruiterData, 'user_id')
  recruiter_data: RecruiterData;

  @HasOne(() => Billing, 'user_id')
  billing: Billing;

  @HasOne(() => CandidateVerification, 'user_id')
  candidate_verification: CandidateVerification;

  @HasOne(() => Job, 'user_id')
  job: Job;

  @HasMany(() => JobApplication, 'user_id')
  job_application: JobApplication[];

  @HasMany(() => SmsCampaign, 'user_id')
  sms_campaign: SmsCampaign[];

  @BelongsToMany(() => Skill, () => CandidateSkill)
  skills: Skill[];

  total_count: number;
}
