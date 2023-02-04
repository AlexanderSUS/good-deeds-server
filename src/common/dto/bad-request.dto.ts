import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDto {
  @ApiProperty({
    example: '4xx',
  })
  statusCode: number;

  @ApiProperty({
    example: 'reason',
  })
  message: string;
}
