import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/order/dtos/CreateOrder.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
