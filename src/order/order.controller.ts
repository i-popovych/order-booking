import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';
import { OrderBookingItemDto } from 'src/order/dtos/OrderIBookingtem.dto';
import { OrderItemDto } from 'src/order/dtos/OrderItem.dto';
import { UpdateOrderDto } from 'src/order/dtos/UpdateOrder.dto';
import { OrderModel } from 'src/order/models/order.model';
import { OrderService } from 'src/order/order.service';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBody({ type: CreateOrderDto, description: 'Create a new order' })
  @ApiResponse({
    status: 201,
    type: OrderModel,
    description: 'Order created successfully',
  })
  @ApiForbiddenResponse({
    description: 'Product with id 1 is not avaliable for rent',
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async create(@Body() dto: CreateOrderDto) {
    const model = await this.orderService.create(dto);
    return model.dataValues;
  }

  @Put(':id/cancel')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
  })
  async cancel(@Param('id') id: number) {
    return this.orderService.cancelOne(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateOrderDto, description: 'Update order' })
  @ApiResponse({
    status: 201,
    type: OrderItemDto,
    description: 'Order updated successfully',
  })
  @ApiForbiddenResponse({
    description: 'Product with id 1 is not avaliable for rent',
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async update(@Param('id') id: number, @Body() dto: UpdateOrderDto) {
    const order = await this.orderService.update(id, dto);
    return new OrderItemDto(order.dataValues);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [OrderBookingItemDto],
    description: 'Get all orders',
  })
  async getAll(): Promise<OrderBookingItemDto[]> {
    const orders = await this.orderService.getAll();
    return orders.map((order) => new OrderBookingItemDto(order));
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    type: OrderBookingItemDto,
    description: 'Get order by ID',
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async getOne(@Param('id') id: number): Promise<OrderBookingItemDto> {
    return new OrderBookingItemDto(
      await this.orderService.getOneWithBooking(id),
    );
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Delete order by ID',
  })
  async deleteOne(@Param('id') id: number) {
    return this.orderService.deleteById(id);
  }
}
