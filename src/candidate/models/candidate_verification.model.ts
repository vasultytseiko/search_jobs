import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.model';
import { PersonalDocumentType } from './personal_document_type.model';
import { ExperienceDocumentType } from './experience_document_type.model';

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

interface CandidateVerificationAttributes {
  user_id: string;
  personal_document_name: string;
  personal_document_type_id: string;
  personal_document_status: DocumentStatus;
  experience_document_name: string;
  experience_document_type_id: string;
  experience_document_status: DocumentStatus;
}

@Table({ tableName: 'candidate_verification' })
export class CandidateVerification extends Model<
  CandidateVerification,
  CandidateVerificationAttributes
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
    unique: true,
  })
  user_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  personal_document_name?: string;

  @ForeignKey(() => PersonalDocumentType)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  personal_document_type_id?: string;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentStatus)),
    allowNull: true,
    defaultValue: DocumentStatus.PENDING,
  })
  personal_document_status?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  experience_document_name?: string;

  @ForeignKey(() => ExperienceDocumentType)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  experience_document_type_id?: string;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentStatus)),
    allowNull: true,
    defaultValue: DocumentStatus.PENDING,
  })
  experience_document_status?: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => PersonalDocumentType)
  personal_document_type: PersonalDocumentType;

  @BelongsTo(() => ExperienceDocumentType)
  experience_document_type: ExperienceDocumentType;
}
