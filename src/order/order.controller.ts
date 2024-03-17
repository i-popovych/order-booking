import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';
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
    type: OrderModel,
    description: 'Order updated successfully',
  })
  async update(@Param('id') id: number, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(id, dto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: Array<OrderItemDto>,
    description: 'Get all orders',
  })
  async getAll(): Promise<OrderItemDto[]> {
    const orders = await this.orderService.getAll();
    return orders.map((order) => new OrderItemDto(order));
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    type: OrderItemDto,
    description: 'Get order by ID',
  })
  async getOne(@Param('id') id: number): Promise<OrderItemDto> {
    return new OrderItemDto(await this.orderService.getOne(id));
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
