import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalSerializer } from './serializers/local.serializer';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthUser } from './model/auth_user.model';
import { EmailModule } from 'src/3rd-party/email/email.module';
import { PostcodesModule } from 'src/3rd-party/postcodes.io/postcodes.module';
import { EsendexModule } from 'src/3rd-party/esendex/esendex.module';

@Module({
  imports: [
    SequelizeModule.forFeature([AuthUser]),
    UserModule,
    EmailModule,
    JwtModule,
    PostcodesModule,
    EsendexModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalSerializer, LocalStrategy],
})
export class AuthModule {}
