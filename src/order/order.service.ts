import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { BookingService } from 'src/booking/booking.service';
import { BookingModel } from 'src/booking/models/booking.model';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';
import { OrderBookingModel } from 'src/order/models/order-booking.model';
import { OrderModel } from 'src/order/models/order.model';

@Injectable()
export class OrderService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly bookingService: BookingService,
    @InjectModel(OrderModel)
    private readonly orderRepository: typeof OrderModel,
    @InjectModel(OrderBookingModel)
    private readonly orderBookingRepository: typeof OrderBookingModel,
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
          bookingId,
          start_date,
          end_date,
        );

        if (!isAvailable) {
          throw new HttpException(
            `Product with ${bookingId} is not available`,
            HttpStatus.GONE,
          );
        }

        const booking = await this.bookingService.updateBooking(bookingId, {
          booked_from: start_date,
          booked_to: end_date,
        });

        await this.orderBookingRepository.create(
          {
            booking_id: booking.id,
            order_id: order.id,
          },
          transactionHost,
        );
      }
    });
  }

  async getOne(id: number) {
    const order = await this.orderRepository.findByPk(id, {
      include: [BookingModel],
      nest: true,
    });

    if (!order) {
      throw new NotFoundException('No order found');
    }

    return order.get({ plain: true });
  }

  async getAll() {
    const orders = await this.orderRepository.findAll({
      include: [BookingModel],
      nest: true,
    });

    if (!orders) {
      throw new NotFoundException('No order found');
    }

    return orders.map((order) => order.get({ plain: true }));
  }
}
