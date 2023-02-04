import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  friendsIds: string[];
}
