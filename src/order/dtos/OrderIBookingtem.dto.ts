import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BookingItemDto } from 'src/booking/dtos/BookingItem.dto';

export class OrderBookingItemDto {
  private getNightPrice = (price_per_night: number) => {
    const start = new Date(this.start_date).getTime();
    const end = new Date(this.end_date).getTime();
    const nights = (end - start) / (1000 * 60 * 60 * 24);
    return nights * price_per_night;
  };

  @ApiProperty({
    description: 'Sum of all booking items of orders in dollars',
    example: 120,
  })
  price: number;

  constructor(values: Partial<Omit<OrderBookingItemDto, 'bookings'>>) {
    Object.assign(this, values);

    if (this.bookings.length) {
      this.price = this.bookings.reduce((acc, item) => {
        return (acc += this.getNightPrice(item.price_per_night));
      }, 0);
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
