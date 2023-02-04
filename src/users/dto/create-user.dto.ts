import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nickname: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 20,
  })
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
