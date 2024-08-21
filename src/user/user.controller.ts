import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CookieAuthenticationGuard } from 'src/auth/guards/cookie-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { ApiUserProfileUpdate } from './swagger/user.decorators';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiUserProfileUpdate()
  @Patch('')
  @UseGuards(CookieAuthenticationGuard)
  async updateProfile(
    @Req() request: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(request.user, updateUserDto);
  }
}
