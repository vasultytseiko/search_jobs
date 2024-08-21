import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, ValidateIf } from 'class-validator';

// These parameters are being sent together from same form, but technically belong to different tables
export class UpdateUserDto extends CreateUserDto {
  @ApiProperty()
  @IsBoolean()
  @ValidateIf((o) => !o.company_name)
  agreement_to_contact: boolean;

  @ApiProperty()
  @ValidateIf((o) => o.agreement_to_contact !== undefined)
  company_name: string;
}
