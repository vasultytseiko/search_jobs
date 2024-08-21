import {
  Controller,
  Post,
  Body,
  Req,
  Param,
  UseGuards,
  Get,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpException,
  Patch,
  HttpCode,
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { LogInWithCredentialsGuard } from './guards/login-with-credentials.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { CookieAuthenticationGuard } from './guards/cookie-auth.guard';

import * as passport from 'passport';
import { SESSION_COOKIE_NAME } from './constants';
import { SignInDto } from './dto/sign-in.dto';

import { ResetPasswordDto } from './dto/reset.password.dto';
import { ForgotPasswordDto } from './dto/forgot.password.dto';
import { UpdatePasswordDto } from 'src/auth/dto/update-password.dto';
import { ForgotPasswordOTPDto } from './dto/forgot.password.otp.dto';
import { ResetPasswordOTPDto } from './dto/reset.password.otp.dto';
import { transformNumber } from 'src/user/features/transform.phone.number';
import {
  ApiSignUp,
  ApiSignIn,
  ApiAuthenticate,
  ApiSignOut,
  ApiResetPasswEmailGen,
  ApiValidateResetTokenEmail,
  ApiResetPasswordToken,
  ApiUpdatePassword,
  ApiResetPasswOtpGen,
  ApiValidateOtp,
  ApiResetPasswordOtp,
} from './swagger/auth.decorators';
import { UserService } from 'src/user/user.service';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiSignUp()
  @Post('sign-up')
  async register(
    @Req() req: Request,
    @Body() signUpDTO: SignUpDTO,
    @Res() res: Response,
  ) {
    const user = await this.authService.register(signUpDTO);
    req.body.email = signUpDTO.userData.email;
    req.body.password = signUpDTO.userData.password;
    // Sign in right after sign up.
    return new Promise((resolve, reject) =>
      passport.authenticate('local', {})(req, res, (error) => {
        if (error) {
          reject(new HttpException(error.message, error.status));
          return;
        }

        res.status(HttpStatus.CREATED).send(req.user);
        resolve(user);
      }),
    );
  }

  @ApiSignIn()
  @UseGuards(LogInWithCredentialsGuard)
  @Post('sign-in')
  async logIn(
    @Req() request: RequestWithUser,
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ) {
    const user = request.user;
    const { role, rememberMe } = signInDto;
    const {
      role: { role: userRole },
    } = user;

    // Check if the user is trying to sign in as the same role as the one they have.
    if (role !== userRole) {
      request.session.destroy(() => {
        res
          .clearCookie(SESSION_COOKIE_NAME)
          .status(HttpStatus.BAD_REQUEST)
          .send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Seems like you already have an account as ${userRole}. Please, sign in as ${userRole}.`,
          });
      });

      return;
    }

    if (!rememberMe) {
      // Default session expiration is 7 days.
      // Set the session to expire in 3 hours if "Remember me" is not checked.
      request.session.cookie.maxAge = 1000 * 60 * 60 * 3;
    }

    await this.authService.revokeUserActiveSessions(
      user.id,
      request.session.id,
    );

    res.status(HttpStatus.OK).send(user);
  }

  @ApiAuthenticate()
  @UseGuards(CookieAuthenticationGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser) {
    return this.userService.getFullUserInfo(request.user.id);
  }

  @ApiSignOut()
  @UseGuards(CookieAuthenticationGuard)
  @Post('sign-out')
  async logOut(@Req() request: RequestWithUser, @Res() res: Response) {
    request.session.destroy(() => {
      res.clearCookie(SESSION_COOKIE_NAME).sendStatus(200);
    });
  }

  @ApiUpdatePassword()
  @Patch('password')
  @UseGuards(CookieAuthenticationGuard)
  async updatePassword(
    @Req() request: RequestWithUser,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePasswordFromProfileSettings(
      request.user,
      updatePasswordDto,
    );
  }

  @ApiResetPasswEmailGen()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password/email')
  async resetPasswordByEmailGenerate(
    @Body() forgotPasswordDtoDto: ForgotPasswordDto,
  ) {
    await this.authService.generateResetPasswordLinkEmail(forgotPasswordDtoDto);
  }

  @ApiValidateResetTokenEmail()
  @Get('reset-password/email')
  validateResetToken(@Query('token') token: string) {
    return this.authService.validateResetToken(token);
  }

  @ApiResetPasswordToken()
  @HttpCode(HttpStatus.OK)
  @Patch('/reset-password/email/:token')
  async resetPasswordByEmailToken(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    await this.authService.resetPasswordByEmailToken(resetPasswordDto, token);
  }

  @ApiResetPasswOtpGen()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password/otp')
  async resetPasswordOtpGenerate(
    @Body() forgotPasswordDto: ForgotPasswordOTPDto,
  ) {
    return this.authService.resetPasswordOtpGenerate(forgotPasswordDto);
  }

  @ApiValidateOtp()
  @Get('reset-password/otp')
  validateOtp(
    @Query('otp') otp: string,
    @Query('phone_number') phoneNumber: string,
  ) {
    phoneNumber = transformNumber(phoneNumber);
    return this.authService.validateOtp(otp, phoneNumber);
  }

  @ApiResetPasswordOtp()
  @HttpCode(HttpStatus.OK)
  @Patch('reset-password/otp/:otp')
  async resetPasswordOtp(
    @Param('otp') otp: string,
    @Body() resetPasswordOtpDto: ResetPasswordOTPDto,
  ) {
    return this.authService.resetPasswordOtp(resetPasswordOtpDto, otp);
  }
}
