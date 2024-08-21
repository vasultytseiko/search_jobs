import { IsEmail, NotContains, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, Validate } from 'class-validator';
import { RoleValidation } from 'src/user/validators/role.validator';

export class SignInDto {
  @ApiProperty()
  @Validate(RoleValidation)
  role: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @NotContains(' ')
  password: string;

  @ApiProperty()
  @IsBoolean()
  rememberMe: boolean;
}
