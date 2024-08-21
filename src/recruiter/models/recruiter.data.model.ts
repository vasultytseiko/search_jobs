import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { User } from '../../user/models/user.model';

interface RecruiterDataAttribute {
  company_name: string;
  user_id: string;
}

@Table({ tableName: 'recruiter_data' })
export class RecruiterData extends Model<
  RecruiterData,
  RecruiterDataAttribute
> {
  @Column({
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  company_name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  user_id: string;

  @BelongsTo(() => User)
  user: User;
}
