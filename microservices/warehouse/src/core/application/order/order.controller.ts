import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { OrderIdDto } from "./dto/order-id.dto";
import { OrderDto } from "./dto/order.dto";
import type { OrderCommandUseCase } from "./use-cases/order.usecase.command";
import type { OrderQueryUseCase } from "./use-cases/order.usecase.query";

@Controller('orders')
export class OrderController {
  constructor(
    @Inject('OrderCommandUseCase')
    private readonly orderCommandUseCase: OrderCommandUseCase,
    @Inject('OrderQueryUseCase')
    private readonly orderQueryUseCase: OrderQueryUseCase,
  ) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto): Promise<void> {
    return this.orderCommandUseCase.createOrder(dto);
  }

  @Patch(':id/cancel')
  async cancelOrder(@Param('id') orderId: string): Promise<void> {
    return this.orderCommandUseCase.cancelOrder({ orderId });
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string): Promise<OrderDto | null> {
    return this.orderQueryUseCase.getOrderById({ orderId });
  }

  @Get()
  async listOrders(): Promise<OrderDto[]> {
    return this.orderQueryUseCase.listOrders();
  }
}