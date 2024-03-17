import { ApiProperty } from '@nestjs/swagger';
import { BookingItemDto } from 'src/booking/dtos/BookingItem.dto';

export class OrderItemDto {
  @ApiProperty({
    description: 'Sum of all booking items of orders in dollars',
    example: 120,
  })
  price: number;

  constructor(values: Partial<Omit<OrderItemDto, 'bookings'>>) {
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
    type: Array<BookingItemDto>,
  })
  bookings: BookingItemDto[];
}
