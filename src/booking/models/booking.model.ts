import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { OrderBookingModel } from 'src/order/models/order-booking.model';
import { OrderModel } from 'src/order/models/order.model';

interface BookingCreatingAttrs {
  room: string;
  max_guests: number;
  price_per_night: number;
  has_wifi: boolean;
  has_balcony: boolean;
  booked_from?: Date;
  booked_to?: Date;
}

@Table({ tableName: 'booking' })
export class BookingModel extends Model<BookingModel, BookingCreatingAttrs> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier',
  })
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty({ example: '101a', description: 'Room name' })
  @Column({ type: DataType.STRING })
  room: string;

  @ApiProperty({ example: 2, description: 'Maximum number of guests' })
  @Column({ type: DataType.INTEGER })
  max_guests: number;

  @ApiProperty({ example: 100, description: 'Price per night in dollars' })
  @Column({ type: DataType.BIGINT })
  price_per_night: number;

  @ApiProperty({ example: true, description: 'Availability of WiFi' })
  @Column({ type: DataType.BOOLEAN })
  has_wifi: boolean;

  @ApiProperty({ example: true, description: 'Availability of balcony' })
  @Column({ type: DataType.BOOLEAN })
  has_balcony: boolean;

  @CreatedAt
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-20T00:00:00Z',
    description: 'Updated at date',
  })
  @UpdatedAt
  updatedAt: Date;

  @BelongsToMany(() => OrderModel, () => OrderBookingModel)
  orders: OrderModel[];
}
