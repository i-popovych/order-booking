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
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from 'src/booking/booking.service';
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
    type: [BookingModel],
    description: 'Get all bookings',
  })
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    type: BookingModel,
    description: 'Get booking by ID',
  })
  getBookingById(@Param('id') id: number) {
    return this.bookingService.getBookingById(id);
  }

  @Post()
  @ApiBody({ type: CreateBookingDto, description: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    type: BookingModel,
    description: 'Booking created successfully',
  })
  createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
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
  updateBooking(@Param('id') id: number, @Body() dto: UpdateBookingDto) {
    if (!Object.keys(dto).length) {
      throw new BadRequestException(
        'Data must be provided to update the booking',
      );
    }

    return this.bookingService.updateBooking(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Delete booking object' })
  deleteBooking(@Param('id') id: number) {
    return this.bookingService.deleteBooking(id);
  }
}
