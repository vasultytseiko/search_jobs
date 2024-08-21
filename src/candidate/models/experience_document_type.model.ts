import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { CandidateVerification } from './candidate_verification.model';

interface ExperienceDocumentTypeAttributes {
  name: string;
}

@Table({ tableName: 'experience_document_type', timestamps: false })
export class ExperienceDocumentType extends Model<
  ExperienceDocumentType,
  ExperienceDocumentTypeAttributes
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => CandidateVerification)
  candidate_verifications: CandidateVerification[];
}
