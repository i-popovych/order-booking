import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BookingModel } from 'src/booking/models/booking.model';
import { OrderBookingModel } from 'src/order/models/order-booking.model';
import { OrderModel } from 'src/order/models/order.model';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderBookingModel, OrderModel, BookingModel]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [],
})
export class OrderModule {}
