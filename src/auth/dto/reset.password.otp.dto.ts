import { IsNotEmpty, NotContains, Validate } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import { PhoneNumberValidation } from '../../user/validators/phone-number.validator';
import { transformNumber } from 'src/user/features/transform.phone.number';

export class ResetPasswordOTPDto {
  @ApiProperty()
  @IsNotEmpty()
  @Validate(PhoneNumberValidation)
  @Transform(({ value }) => transformNumber(value))
  phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @NotContains(' ')
  password: string;
}
