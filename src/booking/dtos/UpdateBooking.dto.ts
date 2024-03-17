import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from 'src/booking/dtos/CreateBooking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
