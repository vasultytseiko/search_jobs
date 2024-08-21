import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { User } from 'src/user/models/user.model';
import { Job } from './job.model';

interface JobApplicationAttribute {
  job_id: string;
  user_id: string;
}

@Table({ tableName: 'job_application' })
export class JobApplication extends Model<
  JobApplication,
  JobApplicationAttribute
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Job)
  @Column({
    type: DataType.UUID,
  })
  job_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  user_id: string;

  @BelongsTo(() => Job)
  job: Job;

  @BelongsTo(() => User)
  user: User;
}
