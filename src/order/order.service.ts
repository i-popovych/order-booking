import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { BookingService } from 'src/booking/booking.service';
import { BookingModel } from 'src/booking/models/booking.model';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';
import { UpdateOrderDto } from 'src/order/dtos/UpdateOrder.dto';
import { OrderBookingModel } from 'src/order/models/order-booking.model';
import { OrderModel } from 'src/order/models/order.model';

@Injectable()
export class OrderService {
  constructor(
    private readonly bookingService: BookingService,
    @InjectModel(OrderModel)
    private readonly orderRepository: typeof OrderModel,
    @InjectModel(OrderBookingModel)
    private readonly orderBookingRepository: typeof OrderBookingModel,
  ) {}

  async create(dto: CreateOrderDto) {
    const { booking_ids, start_date, end_date } = dto;

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
    }

    const order = await this.orderRepository.create({
      start_date,
      end_date,
    });

    for (const bookingId of booking_ids) {
      await this.bookingService.updateBooking(bookingId, {
        booked_from: start_date,
        booked_to: end_date,
      });

      await this.orderBookingRepository.create({
        booking_id: bookingId,
        order_id: order.id,
      });
    }

    return order;
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
      await this.bookingService.updateBooking(booking.id, {
        booked_from: start_date,
        booked_to: end_date,
      });

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

    for (const booking of order.bookings) {
      await this.bookingService.updateBooking(booking.id, {
        booked_from: null,
        booked_to: null,
      });
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
