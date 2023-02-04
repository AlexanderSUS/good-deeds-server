import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateMongoId } from 'src/pipes/validate-mongo-id.pipe';
import { UpdatePasswordDto } from './dto/update-password.dto';
import MongooseClassSerializerInterceptor from 'src/common/mongooseClassSerializer.interceptor';
import { User } from './user.schema';

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

  @Patch(':id')
  update(
    @Param('id', ValidateMongoId) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/password')
  updatePassword(
    @Param('id', ValidateMongoId) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoId) id: string) {
    return this.usersService.remove(id);
  }
}
