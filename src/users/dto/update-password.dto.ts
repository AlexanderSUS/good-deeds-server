import { IsNotEmpty, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdatePasswordDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @Length(8, 20)
  oldPassword: string;

  @IsNotEmpty()
  @Length(8, 20)
  newPassword: string;
}
