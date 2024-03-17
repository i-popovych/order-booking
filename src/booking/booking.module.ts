import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingModel } from 'src/booking/models/booking.model';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [SequelizeModule.forFeature([BookingModel])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
