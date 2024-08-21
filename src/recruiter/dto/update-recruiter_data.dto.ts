import { PartialType } from '@nestjs/swagger';
import { CreateRecruiterDataDto } from './create-recruiter_data.dto';

export class UpdateRecruiterDataDto extends PartialType(
  CreateRecruiterDataDto,
) {}
