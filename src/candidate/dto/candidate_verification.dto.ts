import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { DocumentStatus } from 'src/candidate/models/candidate_verification.model';

export class CandidateVerificationDto {
  @ApiProperty()
  @IsUUID('4')
  user_id: string;

  @ApiProperty({
    enum: DocumentStatus,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  personal_document_status?: DocumentStatus;

  @ApiProperty({
    enum: DocumentStatus,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  experience_document_status?: DocumentStatus;
}
