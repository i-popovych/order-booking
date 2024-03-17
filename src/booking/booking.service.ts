import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBookingDto } from 'src/booking/dtos/CreateBooking.dto';
import { UpdateBookingDto } from 'src/booking/dtos/UpdateBooking.dto';
import { BookingModel } from 'src/booking/models/booking.model';
import { OrderModel } from 'src/order/models/order.model';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(BookingModel)
    private readonly bookingRepository: typeof BookingModel,
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<BookingModel> {
    return await this.bookingRepository.create(dto);
  }

  async getAllBookings(): Promise<BookingModel[]> {
    return await this.bookingRepository.findAll();
  }

  async getBookingById(id: number): Promise<BookingModel> {
    const booking = await this.bookingRepository.findByPk(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async updateBooking(
    id: number,
    dto: UpdateBookingDto,
  ): Promise<BookingModel> {
    const booking = await this.getBookingById(id);
    return await booking.update(dto);
  }

  async deleteBooking(id: number): Promise<void> {
    const booking = await this.getBookingById(id);
    await booking.destroy();
  }

  async isAvailable(
    id: number,
    start_date: Date,
    end_date: Date,
  ): Promise<boolean> {
    const booking = await this.bookingRepository.findByPk(id, {
      include: [OrderModel],
    });

    if (!booking) {
      return false;
    }

    let isOverlapping = false;

    if (!booking.orders.length) {
      return true;
    }

    for (const order of booking.orders) {
      isOverlapping =
        (start_date <= order.start_date && start_date >= order.end_date) ||
        (end_date >= order.start_date && end_date <= order.end_date);
    }

    return !isOverlapping;
  }
}
