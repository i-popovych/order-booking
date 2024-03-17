import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingModel } from 'src/booking/models/booking.model';

@Module({
  imports: [SequelizeModule.forFeature([BookingModel])],
  controllers: [],
  providers: [],
  exports: [],
})
export class BookingModule {}
