import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CandidateDataService } from './candidate_data.service';
import { CandidateData } from './models/candidate_data.model';
import { CandidateSkill } from 'src/candidate/models/candidate_skill.model';
import { PersonalDocumentType } from './models/personal_document_type.model';
import { ExperienceDocumentType } from './models/experience_document_type.model';
import { CandidateVerification } from './models/candidate_verification.model';
import { CandidateDataController } from './candidate_data.controller';
import { StorageModule } from 'src/3rd-party/storage/storage.module';
import { Skill } from 'src/experience/models/skill.model';
import { PostcodesModule } from 'src/3rd-party/postcodes.io/postcodes.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CandidateData,
      CandidateSkill,
      PersonalDocumentType,
      ExperienceDocumentType,
      CandidateVerification,
      Skill,
    ]),
    StorageModule,
    PostcodesModule,
  ],
  controllers: [CandidateDataController],
  providers: [CandidateDataService],
  exports: [CandidateDataService],
})
export class CandidateDataModule {}
