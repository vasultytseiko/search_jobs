import { IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRecruiterDataDto {
  @ApiProperty()
  @IsNotEmpty()
  company_name: string;
}
