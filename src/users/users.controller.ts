import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateMongoId } from 'src/pipes/validate-mongo-id.pipe';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserGuard } from 'src/auth/guards/user.guard';
import { UserDto } from './dto/user.dto';
import { BadRequestDto } from 'src/common/dto/bad-request.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: [UserDto] })
  async findAll() {
    return (await this.usersService.findAll()).map(
      ({ _id, friendsIds, nickname }) => ({
        _id,
        friendsIds,
        nickname,
      }),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  async findOne(@Param('id', ValidateMongoId) id: string) {
    const { password, refreshTokenHash, ...userResponse } =
      await this.usersService.findOne(id);

    return userResponse;
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { password, refreshTokenHash, ...userResponse } =
      await this.usersService.update(id, updateUserDto);

    return userResponse;
  }

  @UseGuards(UserGuard)
  @Patch(':id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestDto })
  async updatePassword(
    @Param('id', ValidateMongoId) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(id, updatePasswordDto);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth()
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestDto })
  remove(@Param('id', ValidateMongoId) id: string) {
    return this.usersService.remove(id);
  }
}
