import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { YearsExperience } from '../../experience/models/years.experience.model';
import { HospitalityEstablishment } from 'src/experience/models/hospitality_establishment.model';
import { HospitalityRole } from 'src/experience/models/hospitality_role.model';
import { ConstructionRole } from 'src/experience/models/construction_role.model';
import { ConstructionCardType } from 'src/experience/models/construction_card_type.model';
import { Sector } from 'src/experience/models/sector.model';

interface SmsCampaignFilterAttribute {
  sector_id: string;
  hospitality_role_id: string;
  hospitality_establishment_id: string;
  construction_role_id: string;
  construction_card_type_id: string;
  years_experience_id: string;
  postcode: string;
  distance: number;
  verified: boolean;
}

@Table({ tableName: 'sms_campaign_filter' })
export class SmsCampaignFilter extends Model<
  SmsCampaignFilter,
  SmsCampaignFilterAttribute
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
  hospitality_role_id: string;

  @ForeignKey(() => HospitalityEstablishment)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  hospitality_establishment_id: string;

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
    allowNull: true,
  })
  years_experience_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  verified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  postcode: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  distance: number;

  @BelongsTo(() => YearsExperience)
  years_experience: YearsExperience;

  @BelongsTo(() => Sector)
  sector: Sector;

  @BelongsTo(() => HospitalityRole)
  hospitality_role: HospitalityRole;

  @BelongsTo(() => HospitalityEstablishment)
  hospitality_establishment: HospitalityEstablishment;

  @BelongsTo(() => ConstructionRole)
  construction_role: ConstructionRole;

  @BelongsTo(() => ConstructionCardType)
  construction_card_type: ConstructionCardType;
}
