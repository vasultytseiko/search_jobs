import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PostcodesService } from './postcodes.service';
import { PostcodeValidation } from './validators/postcode.validator';

@Module({
  imports: [HttpModule],
  providers: [PostcodesService, PostcodeValidation],
  exports: [PostcodesService],
})
export class PostcodesModule {}
