import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { BookingModel } from 'src/booking/models/booking.model';
import { OrderBookingModel } from 'src/order/models/order-booking.model';

interface OrderCreationAttrs {
  start_date: Date;
  end_date: Date;
}

@Table({ tableName: 'orders' })
export class OrderModel extends Model<OrderModel, OrderCreationAttrs> {
  @ApiProperty({ example: '2024-03-15T00:00:00Z', description: 'Start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  start_date: Date;

  @ApiProperty({ example: '2024-03-20T00:00:00Z', description: 'End date' })
  @Column({ type: DataType.DATE, allowNull: false })
  end_date: Date;

  @BelongsToMany(() => BookingModel, () => OrderBookingModel)
  bookings: BookingModel[];
}
