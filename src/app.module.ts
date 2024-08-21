import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import * as passport from 'passport';

import { AuthMiddleware } from './firebase/middleware/firebase-auth.middleware';
import { FirebaseModule } from './firebase/modules/firebase.module';
import { StripeModule } from './3rd-party/stripe/stripe.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';

import { Role } from './role/models/role.model';
import { User } from './user/models/user.model';
import { RecruiterData } from './recruiter/models/recruiter.data.model';
import { CandidateData } from './candidate/models/candidate_data.model';
import { PricingPlan } from './pricing.plan/models/pricing.plan.model';
import { PricingPlanFeature } from './pricing.plan/models/pricing.plan.feature.model';

import { DailyJobUpdate } from './experience/models/daily.job.update.model';
import { HospitalityRole } from './experience/models/hospitality_role.model';
import { YearsExperience } from './experience/models/years.experience.model';
import { Job } from './job/models/job.model';
import { JobApplication } from './job/models/job_application.model';
import { CandidateDataModule } from './candidate/candidate_data.module';
import { RecruiterDataModule } from './recruiter/recruiter_data.module';
import { UserController } from './user/user.controller';
import { HospitalityEstablishment } from './experience/models/hospitality_establishment.model';
import { SmsCampaignModule } from './sms.campaign/sms.campaign.module';
import { SmsCampaign } from './sms.campaign/models/sms_campaign.model';
import { SmsCampaignCandidate } from './sms.campaign/models/sms_campaign_candidate.model';
import { SlackModule } from './3rd-party/slack/slack.module';
import { AuthUser } from './auth/model/auth_user.model';
import { PaymentMethod } from './payment/models/payment.method.model';
import { Billing } from './payment/models/billing.model';
import { ExperienceModule } from './experience/experience.module';
import { PaymentModule } from './payment/payment.module';
import { PricingPlanModule } from './pricing.plan/pricing_plan.module';
import { EmailModule } from './3rd-party/email/email.module';
import { PostcodesModule } from './3rd-party/postcodes.io/postcodes.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './common/configs/redis.config';
import { PricingPlanFeatureMap } from './pricing.plan/models/pricing.plan.feature.map.model';
import { Skill } from './experience/models/skill.model';
import { CandidateSkill } from './candidate/models/candidate_skill.model';
import { PersonalDocumentType } from './candidate/models/personal_document_type.model';
import { ExperienceDocumentType } from './candidate/models/experience_document_type.model';
import { CandidateVerification } from './candidate/models/candidate_verification.model';
import { Sector } from './experience/models/sector.model';
import { ConstructionRole } from './experience/models/construction_role.model';
import { ConstructionCardType } from './experience/models/construction_card_type.model';
import { SmsCampaignFilter } from './sms.campaign/models/sms_campaign_filter.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        ssl: configService.get('NODE_ENV') === 'production',
        dialectOptions: {
          ssl: {
            rejectUnauthorized: configService.get('NODE_ENV') === 'production',
            ca: configService.get('DB_SSL_CA'),
          },
        },
        models: [
          Role,
          User,
          AuthUser,
          RecruiterData,
          CandidateData,
          PricingPlan,
          PricingPlanFeature,
          PricingPlanFeatureMap,
          DailyJobUpdate,
          Sector,
          HospitalityRole,
          HospitalityEstablishment,
          ConstructionRole,
          ConstructionCardType,
          YearsExperience,
          Job,
          JobApplication,
          SmsCampaign,
          SmsCampaignFilter,
          SmsCampaignCandidate,
          PaymentMethod,
          Billing,
          Skill,
          CandidateSkill,
          PersonalDocumentType,
          ExperienceDocumentType,
          CandidateVerification,
        ],
        define: {
          underscored: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      }),
    }),
    CacheModule.registerAsync(RedisOptions),

    AuthModule,
    JwtModule,
    UserModule,
    RoleModule,
    FirebaseModule,
    StripeModule,
    CandidateDataModule,
    RecruiterDataModule,
    SmsCampaignModule,
    SlackModule,
    ExperienceModule,
    PaymentModule,
    PricingPlanModule,
    EmailModule,
    PostcodesModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        'v1/billing/credits',
        'v1/billing/subscription',
        'v1/billing/trial-subscription',
        'v1/billing/upgrade',
        'v1/billing/downgrade',
        'v1/billing/renew',
        'v1/billing/invoices',
        'v1/firebase-auth/admin',
        'v1/firebase-auth/suspend',
        'v1/firestore/sms-campaign/filters',
        'v1/firestore/sms-campaign/job',
        'v1/firestore/sms-campaign/applied-job',
        'v1/firestore/sms-campaign/:campaign_id',
        'v1/notify',
      );

    consumer
      .apply(passport.initialize(), passport.session())
      // Exclude v2/experience from the middleware since it returns data that is not user-specific.
      .exclude('/v2/experience')
      .forRoutes('v2/*');
  }
}
