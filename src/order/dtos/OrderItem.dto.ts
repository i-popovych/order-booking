import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class OrderItemDto {
  constructor(values: Partial<OrderItemDto>) {
    Object.assign(this, values);
  }

  @ApiProperty({
    description: 'The unique identifier of the order',
    example: 1,
  })
  readonly id: number;

  @ApiProperty({
    description: 'Start rent date',
    example: '2024-03-20T00:00:00Z',
    type: Date,
  })
  readonly start_date: Date;

  @ApiProperty({
    description: 'Finish rend date',
    example: '2024-03-20T00:00:00Z',
    type: Date,
  })
  readonly end_date: Date;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
