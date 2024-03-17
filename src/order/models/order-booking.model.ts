import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { BookingModel } from 'src/booking/models/booking.model';
import { OrderModel } from 'src/order/models/order.model';

interface OrderBookingCreationAttrs {
  order_id: number;
  booking_id: number;
}

@Table({ tableName: 'order-booking', timestamps: false })
export class OrderBookingModel extends Model<
  OrderBookingModel,
  OrderBookingCreationAttrs
> {
  @Column
  @ForeignKey(() => OrderModel)
  order_id: number;

  @ForeignKey(() => BookingModel)
  @Column
  booking_id: number;
}
