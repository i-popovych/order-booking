import { Exclude } from 'class-transformer';

export class BookingItemDto {
  constructor(partial: Partial<BookingItemDto>) {
    Object.assign(this, partial);
  }
  readonly id: number;

  room: string;
  max_guests: number;
  price_per_night: number;
  has_wifi: boolean;
  has_balcony: boolean;
  booked_from: string;
  booked_to: string;

  @Exclude()
  createdAt: string;
  updatedAt: string;

  @Exclude()
  OrderBookingModel: Record<string, number>;
}
