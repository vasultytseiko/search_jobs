import {
  Injectable,
  HttpStatus,
  HttpException,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as otpGenerator from 'otp-generator';

import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDTO } from './dto/sign-up.dto';
import { AuthUser } from './model/auth_user.model';
import { PostgresErrorCode } from 'src/database/postgres-error-codes.enum';
import { Transaction } from 'sequelize';

import { EmailService } from 'src/3rd-party/email/email.service';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';

import { UpdatePasswordDto } from 'src/auth/dto/update-password.dto';
import { User } from 'src/user/models/user.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ForgotPasswordOTPDto } from './dto/forgot.password.otp.dto';
import { EsendexService } from 'src/3rd-party/esendex/esendex.service';
import { ResetPasswordOTPDto } from './dto/reset.password.otp.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string = process.env.JWT_SECRET;

  private readonly TIME_TO_LIVE_OTP = 15 * 60 * 1000;
  private readonly TIME_ATTEMPT = 4 * 3600 * 1000;

  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(AuthUser) private readonly authRepository: typeof AuthUser,
    private readonly userService: UserService,
    private readonly esendexService: EsendexService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private sequelize: Sequelize,
  ) {}

  public async register(signUpDTO: SignUpDTO) {
    const { userData } = signUpDTO;
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
      const user = await this.sequelize.transaction(async (t) => {
        const authUser = await this.createAuth(
          userData.email,
          hashedPassword,
          t,
        );

        return this.userService.createUserWithRoleInfo(
          signUpDTO,
          authUser.id,
          t,
        );
      });

      return user;
    } catch (error) {
      this.logger.error(error);
      if (error?.original?.code === PostgresErrorCode.ForeignKeyViolation) {
        throw new HttpException(
          'Wrong fields provided.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (error.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException(error.message, error.status);
      }

      throw new HttpException(
        'An error occurred while sign up.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAuth(email: string, password: string, t: Transaction) {
    try {
      return await this.authRepository.create(
        {
          email,
          password,
        },
        { transaction: t },
      );
    } catch (error) {
      if (error?.name === PostgresErrorCode.UniqueError) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'An error occurred while sign up.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAuthenticatedUser(
    signInDto: Omit<SignInDto, 'role' | 'rememberMe'>,
  ) {
    try {
      const { email, password } = signInDto;
      const user = await this.userService.findByEmail(email);
      const { auth_user } = user;

      const passwordMatching = await this.verifyPassword(
        password,
        auth_user.password,
      );

      if (!passwordMatching) throw new Error('Wrong credentials provided.');

      delete user.auth_user;

      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async updatePasswordFromProfileSettings(
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    const { currentPassword, newPassword } = updatePasswordDto;

    const authUser = await this.authRepository.findByPk(user.auth_user_id);
    const passwordsMatching = await this.verifyPassword(
      currentPassword,
      authUser.password,
    );

    if (!passwordsMatching) {
      throw new HttpException(
        'Wrong current password provided.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.updatePassword(authUser.id, hashedPassword);
    } catch (error) {
      throw new HttpException(
        'Updating the password failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateResetPasswordLinkEmail(forgotPasswordDto: ForgotPasswordDto) {
    const auth_user = await this.findOneByEmail(forgotPasswordDto.email);
    if (!auth_user) {
      // Do nothing in case user is not found.
      return;
    }

    if (auth_user.reset_password_email_at) {
      const nowTime = new Date();
      const reqTime =
        nowTime.getTime() - auth_user.reset_password_email_at.getTime();
      if (reqTime < this.TIME_ATTEMPT) {
        throw new HttpException(
          'Reset password was requested not so long time ago. Please, try again later.',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    this.authRepository.update(
      {
        reset_password_email_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      { where: { id: auth_user.id } },
    );

    try {
      const token = this.generateToken(auth_user.id);

      await this.emailService.sendPasswordResetEmail(auth_user.email, token);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Email service is currently unavailable. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateResetToken(token: string) {
    try {
      await this.jwtService.verify(token, {
        secret: this.jwtSecret,
      });
    } catch (error) {
      this.logger.error(error);

      throw new HttpException(
        'The token is invalid or expired. Please try to request a new one.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async resetPasswordByEmailToken(
    resetPasswordDto: ResetPasswordDto,
    token: string,
  ) {
    try {
      const decodedToken = await this.jwtService.verify(token, {
        secret: this.jwtSecret,
      });
      const auth_user = await this.authRepository.findByPk(decodedToken.id);

      const hashPassword = await bcrypt.hash(resetPasswordDto.password, 10);
      await this.updatePassword(auth_user.id, hashPassword);
    } catch (error) {
      throw new HttpException(
        'Updating the password failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPasswordOtpGenerate(forgotPasswordDto: ForgotPasswordOTPDto) {
    const user = await this.userService.findOneByPhoneNumber(
      forgotPasswordDto.phone_number,
    );

    if (!user) return;

    if (user.auth_user.reset_password_otp_at) {
      const nowTime = new Date();
      const reqTime =
        nowTime.getTime() - user.auth_user.reset_password_otp_at.getTime();

      if (reqTime < this.TIME_ATTEMPT) {
        throw new HttpException(
          'Reset password was requested not so long time ago. Please, try again later.',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    this.authRepository.update(
      {
        reset_password_otp_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      { where: { id: user.auth_user_id } },
    );

    const code = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    try {
      await this.esendexService.send(
        forgotPasswordDto.phone_number,
        ` your code to reset password ${code}`,
      );
      await this.cacheManager.store.set(
        `resetPassword:${forgotPasswordDto.phone_number}`,
        code,
        this.TIME_TO_LIVE_OTP,
      );
    } catch (error) {
      throw new HttpException(
        'Reset service is currently unavailable. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateOtp(otp: string, phoneNumber: string) {
    const keyData = await this.cacheManager.store.get(
      `resetPassword:${phoneNumber}`,
    );

    if (otp !== keyData) {
      throw new HttpException(
        'The code is wrong or the time to use it has expired. Please request the new one.',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async resetPasswordOtp(resetPasswordDto: ResetPasswordOTPDto, otp: string) {
    await this.validateOtp(otp, resetPasswordDto.phone_number);

    try {
      const user = await this.userService.findOneByPhoneNumber(
        resetPasswordDto.phone_number,
      );
      const newPasswordHash = await bcrypt.hash(resetPasswordDto.password, 10);
      await this.updatePassword(user.auth_user_id, newPasswordHash);
      await this.cacheManager.store.del(`resetPassword:${user.phone_number}`);
    } catch (error) {
      throw new HttpException(
        'Updating the password failed. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Revokes user's active sessions except the newest one (passed as a parameter).
  async revokeUserActiveSessions(userId: string, sessionId: string) {
    try {
      const keys = await this.cacheManager.store.keys(`sid:${userId}:*`);

      const filteredKeys = keys.filter((key) => key !== sessionId);
      if (!filteredKeys.length) return;

      await this.cacheManager.store.mdel(...filteredKeys);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async updatePassword(authUserId: string, password: string) {
    await this.authRepository.update(
      { password },
      { where: { id: authUserId } },
    );
  }

  private generateToken(id: string) {
    const token = this.jwtService.sign(
      { id },
      { expiresIn: '15m', secret: this.jwtSecret },
    );

    return token;
  }

  private async findOneByEmail(email: string) {
    return this.authRepository.findOne({ where: { email } });
  }
}
