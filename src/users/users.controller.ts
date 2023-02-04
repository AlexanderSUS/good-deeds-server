import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
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
import MongooseClassSerializerInterceptor from 'src/common/mongooseClassSerializer.interceptor';
import { User } from './user.schema';
import { UserGuard } from 'src/auth/guards/user.guard';
import { UserDto } from './dto/user.dto';
import { BadRequestDto } from 'src/common/dto/bad-request.dto';

@ApiTags('users')
@Controller('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: [UserDto] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  findOne(@Param('id', ValidateMongoId) id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
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
