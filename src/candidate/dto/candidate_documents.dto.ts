import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class CandidateDocumentsDto {
  @ApiProperty({
    description:
      'Personal document name - the name of the file uploaded by the candidate.',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  personal_document_name?: string;

  @ApiProperty({
    description:
      'Personal document type ID - the type of the document. Both personal_document_name and personal_document_type_id must be provided together.',
  })
  @IsUUID('4')
  @IsOptional()
  personal_document_type_id?: string;

  @ApiProperty({
    description:
      'Personal document uploaded - a boolean flag indicating if the document is newly uploaded, or it is the old version.',
  })
  @IsOptional()
  @IsBoolean()
  personal_document_uploaded?: boolean;

  @ApiProperty({
    description:
      'Experience document name - the name of the file uploaded by the candidate.',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  experience_document_name?: string;

  @ApiProperty({
    description:
      'Experience document type ID - the type of the document. Both experience_document_name and experience_document_type_id must be provided together.',
  })
  @IsOptional()
  @IsUUID('4')
  experience_document_type_id?: string;

  @ApiProperty({
    description:
      'Experience document uploaded - a boolean flag indicating if the document is newly uploaded, or it is the old version.',
  })
  @IsOptional()
  @IsBoolean()
  experience_document_uploaded?: boolean;
}
