import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateDeedDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;
}
