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
import { BookingModel } from 'src/booking/models/booking.model';
import { OrderBookingModel } from 'src/order/models/order-booking.model';

interface OrderCreationAttrs {
  start_date: Date;
  end_date: Date;
}

//todo: add isWasCancelled field

@Table({ tableName: 'orders' })
export class OrderModel extends Model<OrderModel, OrderCreationAttrs> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier',
  })
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty({ example: '2024-03-15T00:00:00Z', description: 'Start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  start_date: Date;

  @ApiProperty({ example: '2024-03-20T00:00:00Z', description: 'End date' })
  @Column({ type: DataType.DATE, allowNull: false })
  end_date: Date;

  @ApiProperty({
    example: '2024-03-20T00:00:00Z',
    description: 'Created at date',
  })
  @CreatedAt
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-20T00:00:00Z',
    description: 'Updated at date',
  })
  @UpdatedAt
  updatedAt: Date;

  @BelongsToMany(() => BookingModel, () => OrderBookingModel)
  bookings: BookingModel[];
}
