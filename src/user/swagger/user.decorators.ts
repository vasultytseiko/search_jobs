import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiOperation,
  ApiCookieAuth,
} from '@nestjs/swagger';

import { AuthResponseExample } from 'src/auth/swagger/auth.examples';
import { UpdateUserDto } from '../dto/update-user.dto';

export function ApiUserProfileUpdate() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: 'Update basic profile info.',
      description: 'Only for authorized user.',
    }),
    ApiBody({ type: UpdateUserDto }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description:
        'Updates basic information about the user. Returns updated user object.',
      schema: {
        example: AuthResponseExample,
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'Updating the personal information failed. Please try again later.',
    }),
  );
}
