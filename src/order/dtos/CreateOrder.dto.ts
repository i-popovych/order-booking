import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { DateRange } from 'src/common/validation/range.date.validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The id of the booking product',
    example: '101a',
  })
  @IsString()
  readonly booking_id: string;

  @ApiProperty({
    description: 'Start rent date',
    example: '2024-03-20T00:00:00Z',
    type: Date,
  })
  @Transform(({ value }) => {
    return new Date(value);
  })
  @IsDate()
  @DateRange()
  readonly start_date: Date;

  @ApiProperty({
    description: 'Finish rend date',
    example: '2024-03-20T00:00:00Z',
    type: Date,
  })
  @Transform(({ value }) => {
    return new Date(value);
  })
  @IsDate()
  readonly end_date: Date;
}
