import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from './public.decorator';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import RequestWithUser from './interface/reuestWithUser.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import MongooseClassSerializerInterceptor from 'src/common/mongooseClassSerializer.interceptor';
import { User } from 'src/users/user.schema';
import { BadRequestDto } from 'src/common/dto/bad-request.dto';
import { UserDto } from 'src/users/dto/user.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiBadRequestResponse({ type: BadRequestDto })
  @Post('login')
  async login(@Request() request: RequestWithUser) {
    const { user } = request;
    const { _id } = user;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(_id);
    const { cookie: refreshTokenCookie, token } =
      this.authService.getCookieWithJwtRefreshToken(_id);

    await this.usersService.setCurrentRefreshToken(token, _id);

    request.res?.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    user.password = undefined;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestDto })
  async logOut(@Request() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user._id);
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiCookieAuth()
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiBadRequestResponse({ type: BadRequestDto })
  authenticate(@Request() request: RequestWithUser) {
    return request.user;
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  @ApiCookieAuth()
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiBadRequestResponse({ type: BadRequestDto })
  refresh(@Request() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user._id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
