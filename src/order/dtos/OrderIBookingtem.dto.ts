import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BookingItemDto } from 'src/booking/dtos/BookingItem.dto';

export class OrderBookingItemDto {
  @ApiProperty({
    description: 'Sum of all booking items of orders in dollars',
    example: 120,
  })
  price: number;

  constructor(values: Partial<Omit<OrderBookingItemDto, 'bookings'>>) {
    Object.assign(this, values);

    if (this.bookings.length) {
      this.price = this.bookings.reduce(
        (acc, item) => (acc += Number(item.price_per_night)),
        0,
      );
    }

    this.bookings = this.bookings.map((booking) => new BookingItemDto(booking));
  }

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
  @ApiProperty({
    description: 'Booking items that are associated with the order',
    type: [BookingItemDto],
  })
  bookings: BookingItemDto[];

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;
}
