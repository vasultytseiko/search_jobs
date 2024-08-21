import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  NotContains,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCandidateDataDto } from 'src/candidate/dto/create-candidate_data.dto';
import { CreateRecruiterDataDto } from 'src/recruiter/dto/create-recruiter_data.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RoleValidation } from 'src/user/validators/role.validator';

class CreateUserDtoWithPassword extends CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @NotContains(' ')
  password: string;
}

export class SignUpDTO {
  @ApiProperty({ example: 'candidate|recruiter' })
  @Validate(RoleValidation)
  role: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateUserDtoWithPassword)
  userData: CreateUserDtoWithPassword;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCandidateDataDto)
  candidateData?: CreateCandidateDataDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRecruiterDataDto)
  recruiterData?: CreateRecruiterDataDto;
}
