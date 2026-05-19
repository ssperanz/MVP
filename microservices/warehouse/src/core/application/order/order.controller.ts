import { Controller, Get, Patch, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";
import { OrderDispatchedDto } from "./dto/order-dispatched.dto";
import { OrderIdDto } from "./dto/order-id.dto";
import { OrderQueryFacade } from "./order.query.facade";
import { OrderDto } from "./dto/order.dto";

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderQueryFacade: OrderQueryFacade,
  ) {}

  @Post()
  async createOrder(dto: CreateOrderDto): Promise<void> {
    return this.orderService.createOrder(dto);
  }

  @Patch(':id/cancel')
  async cancelOrder(dto: CancelOrderDto): Promise<void> {
    return this.orderService.cancelOrder(dto);
  }

  @Get(':id')
  async getOrderById(dto: OrderIdDto): Promise<OrderDto | null> {
    return this.orderQueryFacade.getOrderById(dto);
  }

  @Get()
  async listOrders(): Promise<OrderDto[]> {
    return this.orderQueryFacade.listOrders();
  }
}