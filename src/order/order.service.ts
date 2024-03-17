import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly bookingService: BookingService,
    @InjectModel(OrderModel)
    private readonly orderRepository: typeof OrderModel,
    @InjectModel(OrderBookingModel)
    private readonly orderBookingRepository: typeof OrderBookingModel,
    private sequelize: Sequelize,
  ) {}

  private async addBookingToOrder(
    bookingIds: Array<number>,
    orderId: number,
    start_date: Date,
    end_date: Date,
  ) {
    for (const bookingId of bookingIds) {
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
        order_id: orderId,
      });

      this.logger.log(`Booking ${bookingId} added to order ${orderId}`);
    }
  }

  async create(dto: CreateOrderDto) {
    const { booking_ids, start_date, end_date } = dto;

    try {
      let order: OrderModel;

      await this.sequelize.transaction(async () => {
        order = await this.orderRepository.create({
          start_date,
          end_date,
        });

        await this.addBookingToOrder(
          booking_ids,
          order.id,
          start_date,
          end_date,
        );

        this.logger.log(`Order created with id ${order.id}`);
      });

      return order;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`);
      throw new HttpException(
        'Error creating order: ' + error.message,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(id: number, dto: UpdateOrderDto) {
    const { booking_ids, start_date, end_date } = dto;

    const order = await this.getOne(id, false);

    if (!order) {
      throw new NotFoundException('No order found');
    }

    if (!booking_ids || !booking_ids.length) {
      order.start_date = start_date;
      order.end_date = end_date;
      await order.save();

      this.logger.log(`Order updated with id ${order.id}`);
      return order;
    }

    try {
      await this.sequelize.transaction(async () => {
        await this.orderBookingRepository.destroy({
          where: { order_id: id },
        });

        await this.addBookingToOrder(booking_ids, id, start_date, end_date);

        order.start_date = start_date;
        order.end_date = end_date;
        await order.save();

        this.logger.log(`Order updated with id ${order.id}`);
      });
    } catch (error) {
      this.logger.error(`Error updating order: ${error.message}`);
      throw new HttpException(
        'Error creating order: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return order;
  }

  async cancelOne(id: number) {
    const order = await this.getOne(id, false);

    if (!order) {
      throw new NotFoundException('No order found');
    }

    await this.orderBookingRepository.destroy({ where: { order_id: id } });

    order.cancelDate = new Date();

    await order.save();

    this.logger.log(`Order cancelled with id ${order.id}`);
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

    this.logger.log('All orders fetched');
    return orders.map((order) => order.get({ plain: true }));
  }

  async deleteById(id: number) {
    const deletedId = await this.orderRepository.destroy({ where: { id } });

    this.logger.log(`Order deleted with id ${id}`);
    return { id: deletedId };
  }
}
