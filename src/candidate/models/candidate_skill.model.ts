import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Skill } from 'src/experience/models/skill.model';
import { User } from 'src/user/models/user.model';

interface CandidateSkillAttribute {
  user_id: string;
  skill_id: string;
}

@Table({ tableName: 'candidate_skill', timestamps: false })
export class CandidateSkill extends Model<
  CandidateSkill,
  CandidateSkillAttribute
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => Skill)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  skill_id: string;
}
