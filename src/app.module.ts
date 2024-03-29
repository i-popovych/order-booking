import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from 'src/app.controller';

import { BookingModule } from 'src/booking/booking.module';
import { BookingModel } from 'src/booking/models/booking.model';
import { LoggingMiddleware } from 'src/common/middleware/logging.middleware';
import { OrderBookingModel } from 'src/order/models/order-booking.model';
import { OrderModel } from 'src/order/models/order.model';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [OrderBookingModel, OrderModel, BookingModel],
      autoLoadModels: true,
      synchronize: true,
    }),
    OrderModule,
    BookingModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
