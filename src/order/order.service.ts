import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { BookingService } from 'src/booking/booking.service';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';
import { OrderModel } from 'src/order/models/order.model';

@Injectable()
export class OrderService {
  constructor(
    private readonly bookingService: BookingService,
    @InjectModel(OrderModel)
    private readonly orderRepository: typeof OrderModel,
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateOrderDto) {
    const { booking_ids, start_date, end_date } = dto;

    await this.sequelize.transaction(async (t) => {
      const transactionHost = { transaction: t };

      const order = await this.orderRepository.create(
        {
          start_date,
          end_date,
        },
        transactionHost,
      );

      for (const bookingId of booking_ids) {
        const isAvailable = await this.bookingService.isAvailable(
          Number(bookingId),
          start_date,
          end_date,
        );

        if (!isAvailable) {
          throw new HttpException(
            `Product with ${bookingId} is not available`,
            HttpStatus.GONE,
          );
        }

        await this.bookingService.updateBooking(Number(bookingId), {
          booked_from: start_date,
          booked_to: end_date,
        });

        await order.$add('booking', bookingId, {
          transaction: transactionHost,
        });
      }
    });

    // return this.orderRepository.create(dto);
  }
}
