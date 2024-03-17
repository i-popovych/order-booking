import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BookingModel } from 'src/booking/models/booking.model';
import { OrderBookingModel } from 'src/order/models/order-booking.model';
import { OrderModel } from 'src/order/models/order.model';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderBookingModel, OrderModel, BookingModel]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class OrderModule {}
