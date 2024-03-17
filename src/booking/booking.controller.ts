import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookingService } from 'src/booking/booking.service';
import { BookingItemDto } from 'src/booking/dtos/BookingItem.dto';
import { CreateBookingDto } from 'src/booking/dtos/CreateBooking.dto';
import { UpdateBookingDto } from 'src/booking/dtos/UpdateBooking.dto';
import { BookingModel } from 'src/booking/models/booking.model';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [BookingItemDto],
    description: 'Get all bookings',
  })
  async getAllBookings(): Promise<BookingItemDto[]> {
    const result = await this.bookingService.getAllBookings();
    return result.map(
      (bookingItem) => new BookingItemDto(bookingItem.dataValues),
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    type: BookingModel,
    description: 'Get booking by ID',
  })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  async getBookingById(@Param('id') id: number) {
    const model = await this.bookingService.getBookingById(id);
    return new BookingItemDto(model.dataValues);
  }

  @Post()
  @ApiBody({ type: CreateBookingDto, description: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    type: BookingModel,
    description: 'Booking created successfully',
  })
  async createBooking(@Body() dto: CreateBookingDto) {
    return new BookingItemDto(
      (await this.bookingService.createBooking(dto)).dataValues,
    );
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({
    type: CreateBookingDto,
    description: 'Update an existing booking',
  })
  @ApiResponse({
    status: 200,
    type: BookingModel,
    description: 'Booking updated successfully',
  })
  async updateBooking(@Param('id') id: number, @Body() dto: UpdateBookingDto) {
    if (!Object.keys(dto).length) {
      throw new BadRequestException(
        'Data must be provided to update the booking',
      );
    }

    const model = await this.bookingService.updateBooking(id, dto);

    return new BookingItemDto(model.dataValues);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Delete booking object' })
  deleteBooking(@Param('id') id: number) {
    return this.bookingService.deleteBooking(id);
  }
}
