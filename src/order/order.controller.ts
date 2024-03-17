import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor() {}

  @Post()
  @ApiBody({ type: CreateOrderDto, description: 'Create a new order' })
  @ApiResponse({
    status: 201,
    // type: Order,
    description: 'Order created successfully',
  })
  async create(@Body() dto: CreateOrderDto) {
    return 'hello';
    // return this.orderService.create(createOrderDto);
  }
}
