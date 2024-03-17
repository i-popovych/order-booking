import { Exclude } from 'class-transformer';

export class BookingItemDto {
  constructor(partial: any) {
    Object.assign(this, partial);
  }
  readonly id: number;

  room: string;
  max_guests: number;
  price_per_night: number;
  has_wifi: boolean;
  has_balcony: boolean;
  booked_from: Date | null;
  booked_to: Date | null;

  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  @Exclude()
  OrderBookingModel: Record<string, number>;
}
