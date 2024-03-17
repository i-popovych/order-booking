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
import { UpdateOrderDto } from 'src/order/dtos/UpdateOrder.dto';
import { OrderBookingModel } from 'src/order/models/order-booking.model';
import { OrderModel } from 'src/order/models/order.model';

import { createNamespace } from 'cls-hooked';

const namespace = createNamespace('sequelize-transaction');
Sequelize.useCLS(namespace);

@Injectable()
export class OrderService {
  constructor(
    private readonly bookingService: BookingService,
    @InjectModel(OrderModel)
    private readonly orderRepository: typeof OrderModel,
    @InjectModel(OrderBookingModel)
    private readonly orderBookingRepository: typeof OrderBookingModel,
    private sequelize: Sequelize,
  ) {}

  async create(dto: CreateOrderDto) {
    const { booking_ids, start_date, end_date } = dto;

    try {
      let order: OrderModel;

      await this.sequelize.transaction(async () => {
        order = await this.orderRepository.create({
          start_date,
          end_date,
        });

        for (const bookingId of booking_ids) {
          const isAvailable = await this.bookingService.isAvailable(
            bookingId,
            start_date,
            end_date,
          );

          if (!isAvailable) {
            throw new Error(`Booking with id ${bookingId} not available`);
          }

          await this.orderBookingRepository.create({
            booking_id: bookingId,
            order_id: order.id,
          });
        }
      });

      return order;
    } catch (error) {
      throw new HttpException(
        'Error creating order: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, dto: UpdateOrderDto) {
    const { booking_ids, start_date, end_date } = dto;

    const order = await this.getOne(id, false);

    if (!order) {
      throw new NotFoundException('No order found');
    }

    order.start_date = start_date;
    order.end_date = end_date;

    if (booking_ids) {
      await order.save();
      return;
    }

    await this.orderBookingRepository.destroy({ where: { order_id: id } });

    await order.save();

    for (const booking of order.bookings) {
      await this.orderBookingRepository.create({
        booking_id: booking.id,
        order_id: id,
      });
    }
  }

  async cancelOne(id: number) {
    const order = await this.getOne(id, false);

    if (!order) {
      throw new NotFoundException('No order found');
    }

    await this.orderBookingRepository.destroy({ where: { order_id: id } });

    order.cancelDate = new Date();

    await order.save();
  }

  async getOne(id: number, isRaw = true) {
    const order = await this.orderRepository.findByPk(id, {
      include: [BookingModel],
      nest: isRaw,
    });

    if (!order) {
      throw new NotFoundException('No order found');
    }

    return isRaw ? order.get({ plain: true }) : order;
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

  async deleteById(id: number) {
    const deletedId = await this.orderRepository.destroy({ where: { id } });

    return { id: deletedId };
  }
}
