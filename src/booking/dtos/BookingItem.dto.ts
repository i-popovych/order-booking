import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BookingItemDto {
  constructor(partial: Partial<BookingItemDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ description: 'The unique identifier of the booking item' })
  readonly id: number;

  @ApiProperty({ description: 'The room name' })
  room: string;

  @ApiProperty({ description: 'The maximum number of guests allowed' })
  max_guests: number;

  @ApiProperty({ description: 'The price per night for the booking item' })
  price_per_night: number;

  @ApiProperty({ description: 'Flag indicating if WiFi is available' })
  has_wifi: boolean;

  @ApiProperty({ description: 'Flag indicating if the room has a balcony' })
  has_balcony: boolean;

  @ApiProperty({
    description: 'The start date of the booking item',
    type: Date,
  })
  booked_from: Date | null;

  @ApiProperty({ description: 'The end date of the booking item', type: Date })
  booked_to: Date | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  OrderBookingModel: Record<string, number>;
}
