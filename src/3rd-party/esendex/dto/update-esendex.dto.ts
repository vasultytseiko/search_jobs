import { PartialType } from '@nestjs/swagger';
import { CreateEsendexDto } from './create-esendex.dto';

export class UpdateEsendexDto extends PartialType(CreateEsendexDto) {}
