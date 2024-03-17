import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsDate, IsNumber } from 'class-validator';
import { DateRange } from 'src/common/validation/range.date.validator';
import { TransformDate } from 'src/common/validation/transform-date.validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The IDs of the booking product',
    example: [1, 2],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  readonly booking_ids: number[];

  @ApiProperty({
    description: 'Start rent date',
    example: '2024-03-19T00:00:00Z',
    type: Date,
  })
  @DateRange()
  @IsDate()
  @TransformDate()
  readonly start_date: Date;

  @ApiProperty({
    description: 'Finish rend date',
    example: '2024-03-20T00:00:00Z',
    type: Date,
  })
  @IsDate()
  @TransformDate()
  readonly end_date: Date;
}
