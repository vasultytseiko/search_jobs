import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { SmsCampaign } from './sms_campaign.model';
import { User } from 'src/user/models/user.model';

interface SmsCampaignCandidateAttribute {
  sms_campaign_id: string;
  candidate_id: string;
}

@Table({ tableName: 'sms_candidate' })
export class SmsCampaignCandidate extends Model<
  SmsCampaignCandidate,
  SmsCampaignCandidateAttribute
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => SmsCampaign)
  @Column({
    type: DataType.UUID,
  })
  sms_campaign_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  candidate_id: string;

  @BelongsTo(() => SmsCampaign)
  sms_campaign: SmsCampaign;

  @BelongsTo(() => User)
  user: User;
}
