import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RecruiterDataService } from './recruiter_data.service';
import { RecruiterData } from './models/recruiter.data.model';

@Module({
  imports: [SequelizeModule.forFeature([RecruiterData])],
  providers: [RecruiterDataService],
  exports: [RecruiterDataService],
})
export class RecruiterDataModule {}
