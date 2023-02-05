import { ApiProperty } from '@nestjs/swagger';

export class DeedDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({
    example: 'Feed a birds',
  })
  title: string;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty()
  userId: string;
}
