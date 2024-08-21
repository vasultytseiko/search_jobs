import { IsNotEmpty, NotContains } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @NotContains(' ')
  password: string;
}
