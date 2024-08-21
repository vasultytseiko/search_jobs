import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Validate,
  ValidateIf,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PostcodeValidation } from 'src/3rd-party/postcodes.io/validators/postcode.validator';

export class SearchCandidateDto {
  @ApiProperty()
  @IsUUID('4')
  sector_id: string;

  @ApiProperty()
  @IsUUID('4')
  @ValidateIf((o) => o.construction_role_id === undefined)
  hospitality_role_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  @ValidateIf((o) => o.construction_role_id === undefined)
  hospitality_establishment_id: string;

  @ApiProperty()
  @IsUUID('4')
  @ValidateIf((o) => o.hospitality_role_id === undefined)
  construction_role_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  @ValidateIf((o) => o.hospitality_role_id === undefined)
  construction_card_type_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  years_experience_id: string;

  @ApiProperty()
  @Transform(({ value }) => {
    return String(value) === 'true';
  })
  @IsBoolean()
  verified: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsUUID('4', { each: true })
  skill_ids: string[];

  @ApiPropertyOptional()
  @Validate(PostcodeValidation)
  @ValidateIf((o) => o.distance !== undefined)
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  postcode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  distance: number;

  @ApiProperty()
  @Min(2)
  @Max(50)
  @IsNumber()
  page_size: number;

  @ApiProperty()
  @Min(1)
  @IsNumber()
  page: number;
}
