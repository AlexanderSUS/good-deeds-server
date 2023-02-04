import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateMongoId } from 'src/pipes/validate-mongo-id.pipe';
import { UpdatePasswordDto } from './dto/update-password.dto';
import MongooseClassSerializerInterceptor from 'src/common/mongooseClassSerializer.interceptor';
import { User } from './user.schema';
import { UserGuard } from 'src/auth/guards/user.guard';

@Controller('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoId) id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(UserGuard)
  @Patch(':id/password')
  updatePassword(
    @Param('id', ValidateMongoId) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  remove(@Param('id', ValidateMongoId) id: string) {
    return this.usersService.remove(id);
  }
}
