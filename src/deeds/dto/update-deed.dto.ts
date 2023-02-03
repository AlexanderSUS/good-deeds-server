import {
  IsBoolean,
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { CreateDeedDto } from './create-deed.dto';

export class UpdateDeedDto extends CreateDeedDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @IsOptional()
  @IsBoolean()
  isDone: boolean;
}
