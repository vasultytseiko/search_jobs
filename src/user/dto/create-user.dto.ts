import {
  IsEmail,
  NotContains,
  IsNotEmpty,
  Validate,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PostcodeValidation } from 'src/3rd-party/postcodes.io/validators/postcode.validator';
import { PhoneNumberValidation } from '../validators/phone-number.validator';
import { transformNumber } from '../features/transform.phone.number';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @NotContains(' ')
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @NotContains(' ')
  last_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(PhoneNumberValidation)
  @Transform(({ value }) => transformNumber(value))
  phone_number: string;

  @ApiProperty()
  @Validate(PostcodeValidation)
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  postcode: string;
}
