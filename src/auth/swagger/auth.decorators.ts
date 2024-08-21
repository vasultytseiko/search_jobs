import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
  ApiQuery,
  ApiOperation,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { SignUpDTO } from '../dto/sign-up.dto';
import { AuthResponseExample } from 'src/auth/swagger/auth.examples';
import { SignInDto } from '../dto/sign-in.dto';
import { ForgotPasswordDto } from '../dto/forgot.password.dto';
import { ResetPasswordDto } from '../dto/reset.password.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { ForgotPasswordOTPDto } from '../dto/forgot.password.otp.dto';
import { ResetPasswordOTPDto } from '../dto/reset.password.otp.dto';

export function ApiSignUp() {
  return applyDecorators(
    ApiBody({ type: SignUpDTO }),
    ApiOkResponse({
      status: HttpStatus.CREATED,
      description:
        'Success sign-up. Adds sid to cookie, and return obj with all data',
      schema: {
        example: AuthResponseExample,
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'An error occurred while logging in after sign up.',
    }),
  );
}

export function ApiSignIn() {
  return applyDecorators(
    ApiBody({ type: SignInDto }),
    ApiOkResponse({
      status: HttpStatus.CREATED,
      description:
        'Success sign-in. Regenerates session, adds sid to cookie, and return obj with all data',
      schema: {
        example: AuthResponseExample,
      },
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Wrong credentials provided.',
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Seems like you already have an account as candidate | recruiter. Please, sign in as recruiter | candidate.',
    }),
  );
}

export function ApiAuthenticate() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      description: 'Returns the currently signed in user.',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Returns obj with all data',
      schema: {
        example: AuthResponseExample,
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Forbidden resource.',
    }),
  );
}

export function ApiSignOut() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      description: 'Destroys sid in cookie',
    }),
    ApiResponse({
      status: HttpStatus.OK,
    }),
  );
}

export function ApiResetPasswEmailGen() {
  return applyDecorators(
    ApiBody({ type: ForgotPasswordDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'Reset password was requested not so long time ago. Please, try again later.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'Email service is currently unavailable. Please try again later.',
    }),
  );
}

export function ApiValidateResetTokenEmail() {
  return applyDecorators(
    ApiQuery({ name: 'token', description: 'JWT token for password reset.' }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Checks if token is valid.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Invalid link or time has passed',
    }),
  );
}

export function ApiResetPasswordToken() {
  return applyDecorators(
    ApiParam({ name: 'token', description: 'JWT token for password reset.' }),
    ApiBody({ type: ResetPasswordDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Resets password.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Updating the password failed. Please try again later.',
    }),
  );
}

export function ApiUpdatePassword() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiBody({ type: UpdatePasswordDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Updates user password.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Wrong current password provided.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Updating the password failed. Please try again later.',
    }),
  );
}

export function ApiResetPasswOtpGen() {
  return applyDecorators(
    ApiBody({ type: ForgotPasswordOTPDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Sends code to phone number',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'Reset password was requested not so long time ago. Please, try again later.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'Reset service is currently unavailable. Please try again later.',
    }),
  );
}

export function ApiValidateOtp() {
  return applyDecorators(
    ApiQuery({ name: 'otp', description: 'OTP code for password reset.' }),
    ApiQuery({
      name: 'phone_number',
      description: 'phone number for password reset.',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Checks if code is valid.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'The code is wrong or the time to use it has expired. Please request the new one.',
    }),
  );
}

export function ApiResetPasswordOtp() {
  return applyDecorators(
    ApiParam({ name: 'otp', description: 'OTP code for password reset.' }),
    ApiBody({ type: ResetPasswordOTPDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Sends code to phone number',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'The code is wrong or the time to use it has expired. Please request the new one.',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Updating the password failed. Please try again later.',
    }),
  );
}
