import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nickname?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  friendsIds?: string[];
}
