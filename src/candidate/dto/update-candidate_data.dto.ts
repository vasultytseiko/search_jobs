import { IsArray, IsOptional, IsUUID } from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';

export class UpdateCandidateDataDto {
  @ApiProperty()
  @IsUUID('4')
  @ValidateIf((o) => !o.construction_role_id)
  hospitality_first_role_id: string;

  @ApiProperty()
  @IsUUID('4')
  @ValidateIf((o) => !o.construction_role_id)
  hospitality_second_role_id: string;

  @ApiProperty()
  @IsUUID('4')
  @ValidateIf((o) => !o.construction_card_type_id)
  hospitality_main_establishment_id: string;

  @ApiProperty()
  @IsUUID('4')
  @ValidateIf((o) => !o.construction_card_type_id)
  hospitality_second_establishment_id: string;

  @ApiProperty()
  @IsUUID('4')
  @ValidateIf((o) => !o.hospitality_first_role_id)
  construction_role_id: string;

  @ApiProperty()
  @IsUUID('4')
  @ValidateIf((o) => !o.hospitality_main_establishment_id)
  construction_card_type_id: string;

  @ApiProperty()
  @IsUUID('4')
  years_experience_id: string;

  @ApiProperty()
  @IsUUID('4')
  daily_job_update_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  skills?: string[];
}
