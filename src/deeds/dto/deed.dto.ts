import { ApiProperty } from '@nestjs/swagger';

export class DeedDto {
  @ApiProperty({
    example: 'Feed a birds',
  })
  title: string;

  @ApiProperty()
  isDone: boolean;
}
