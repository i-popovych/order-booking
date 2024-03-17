import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

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

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  OrderBookingModel: Record<string, number>;
}
