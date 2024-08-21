import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { User } from 'src/user/models/user.model';
import { SmsCampaignCandidate } from './sms_campaign_candidate.model';
import { Job } from 'src/job/models/job.model';
import { SmsCampaignFilter } from './sms_campaign_filter.model';

interface SmsCampaignCreationAttribute {
  user_id: string;
  credits_spent: number;
  message: string;
  amount_of_candidates: number;
  job_id?: string;
  sms_campaign_filter_id?: string;
}

@Table({ tableName: 'sms_campaign' })
export class SmsCampaign extends Model<
  SmsCampaign,
  SmsCampaignCreationAttribute
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    unique: true,
  })
  user_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  credits_spent: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount_of_candidates: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;

  // If the campaign was created by job_id, then it will be linked to a job.
  @ForeignKey(() => Job)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  job_id: string;

  // If the campaign was created by filter_id, then it will be linked to a filter.
  @ForeignKey(() => SmsCampaignFilter)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  sms_campaign_filter_id: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Job)
  job: Job;

  @BelongsTo(() => SmsCampaignFilter)
  sms_campaign_filter: SmsCampaignFilter;

  @HasMany(() => SmsCampaignCandidate, 'sms_campaign_id')
  sms_candidate: SmsCampaignCandidate[];
}
