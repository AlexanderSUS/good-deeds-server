import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nickname: string;

  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
