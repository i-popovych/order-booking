import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrderBookingModel } from 'src/order/models/order-booking.model';
import { OrderModel } from 'src/order/models/order.model';

@Table({ tableName: 'booking' })
export class BookingModel extends Model<BookingModel> {
  @ApiProperty({ example: '101', description: 'Room number' })
  @Column({ type: DataType.STRING })
  room_number: string;

  @ApiProperty({ example: '2', description: 'Maximum number of guests' })
  @Column({ type: DataType.TEXT })
  max_guests: string;

  @ApiProperty({ example: 100, description: 'Price per night in dollars' })
  @Column({ type: DataType.BIGINT })
  price_per_night: number;

  @ApiProperty({ example: true, description: 'Availability of WiFi' })
  @Column({ type: DataType.BOOLEAN })
  has_wifi: boolean;

  @ApiProperty({ example: true, description: 'Availability of balcony' })
  @Column({ type: DataType.BOOLEAN })
  has_balcony: boolean;

  @ApiProperty({
    example: '2024-03-15T00:00:00Z',
    description: 'Available from date',
  })
  @Column({ type: DataType.DATE })
  available_from: Date;

  @ApiProperty({
    example: '2024-03-20T00:00:00Z',
    description: 'Available to date',
  })
  @Column({ type: DataType.DATE })
  available_to: Date;

  @BelongsToMany(() => OrderModel, () => OrderBookingModel)
  orders: OrderModel[];
}
