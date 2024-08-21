import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SmsCampaign } from './models/sms_campaign.model';
import { SmsCampaignCandidate } from './models/sms_campaign_candidate.model';
import { CandidateDataModule } from 'src/candidate/candidate_data.module';
import { UserModule } from 'src/user/user.module';
import { EsendexModule } from 'src/3rd-party/esendex/esendex.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SmsCampaign, SmsCampaignCandidate]),
    CandidateDataModule,
    UserModule,
    EsendexModule,
  ],
})
export class SmsCampaignModule {}
