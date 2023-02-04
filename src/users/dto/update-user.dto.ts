import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nickname?: string;

  @ApiPropertyOptional({
    minLength: 8,
    maxLength: 20,
  })
  @IsOptional()
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  friendsIds?: string[];
}
