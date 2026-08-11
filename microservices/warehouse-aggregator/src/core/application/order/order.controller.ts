import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { OrderIdDto } from './dto/order-id.dto';
import { OrderQueryService } from './order.query.service';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderQueryService: OrderQueryService,
  ) {}

  @Get(':id')
  async getOrderById(
    @Param() dto: OrderIdDto,
  ): Promise<OrderDto | null> {
    return this.orderQueryService.getOrderById(dto);
  }

  @Get('warehouse/:whId')
  async getOrdersByWhId(
    @Param('whId', ParseIntPipe) whId: number,
  ): Promise<OrderDto[] | null> {
    return this.orderQueryService.getOrdersByWhId(whId);
  }

  @Get()
  async listAllOrders(): Promise<OrderDto[]> {
    return this.orderQueryService.listAllOrders();
  }
}