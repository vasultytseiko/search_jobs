import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { CandidateVerification } from './candidate_verification.model';

interface PersonalDocumentTypeAttributes {
  name: string;
}

@Table({ tableName: 'personal_document_type', timestamps: false })
export class PersonalDocumentType extends Model<
  PersonalDocumentType,
  PersonalDocumentTypeAttributes
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
