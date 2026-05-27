import { Controller, Get, Patch, Post } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { OrderIdDto } from "./dto/order-id.dto";
import { OrderDto } from "./dto/order.dto";
import type { OrderCommandUseCase } from "./use-cases/order.usecase.command";
import type { OrderQueryUseCase } from "./use-cases/order.usecase.query";

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderCommandUseCase: OrderCommandUseCase,
    private readonly orderQueryUseCase: OrderQueryUseCase,
  ) {}

  @Post()
  async createOrder(dto: CreateOrderDto): Promise<void> {
    return this.orderCommandUseCase.createOrder(dto);
  }

  @Patch(':id/cancel')
  async cancelOrder(dto: CancelOrderDto): Promise<void> {
    return this.orderCommandUseCase.cancelOrder(dto);
  }

  @Get(':id')
  async getOrderById(dto: OrderIdDto): Promise<OrderDto | null> {
    return this.orderQueryUseCase.getOrderById(dto);
  }

  @Get()
  async listOrders(): Promise<OrderDto[]> {
    return this.orderQueryUseCase.listOrders();
  }
}