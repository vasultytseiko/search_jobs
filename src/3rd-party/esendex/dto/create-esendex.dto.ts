import { IsNotEmpty } from '@nestjs/class-validator';

export class CreateEsendexDto {
  @IsNotEmpty()
  phone_numbers: string[];
  @IsNotEmpty()
  message: string;
}
