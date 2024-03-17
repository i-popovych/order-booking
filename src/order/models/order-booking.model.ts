import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { BookingModel } from 'src/booking/models/booking.model';
import { OrderModel } from 'src/order/models/order.model';

@Table({ tableName: 'order-booking', timestamps: false })
export class OrderBookingModel extends Model<OrderBookingModel> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  @ForeignKey(() => OrderModel)
  @Column
  order_id: number;

  @ForeignKey(() => BookingModel)
  @Column
  booking_id: number;
}
