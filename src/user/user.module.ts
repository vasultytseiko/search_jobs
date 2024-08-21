import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './models/user.model';
import { RoleModule } from 'src/role/role.module';
import { CandidateDataModule } from 'src/candidate/candidate_data.module';
import { RecruiterDataModule } from 'src/recruiter/recruiter_data.module';
import { PricingPlanModule } from 'src/pricing.plan/pricing_plan.module';
import { PostcodesModule } from 'src/3rd-party/postcodes.io/postcodes.module';
import { PaymentModule } from 'src/payment/payment.module';
import { AuthUser } from 'src/auth/model/auth_user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, AuthUser]),
    RoleModule,
    CandidateDataModule,
    RecruiterDataModule,
    PricingPlanModule,
    PaymentModule,
    PostcodesModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
