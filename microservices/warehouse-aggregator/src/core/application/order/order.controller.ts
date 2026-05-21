import { Controller, Get, Patch, Post } from "@nestjs/common";
import { OrderIdDto } from "./dto/order-id.dto";
import { OrderQueryFacade } from "./order.query.facade";
import { OrderDto } from "./dto/order.dto";

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderQueryFacade: OrderQueryFacade,
  ) {}

  @Get(':id')
  async getOrderById(dto: OrderIdDto): Promise<OrderDto | null> {
    return this.orderQueryFacade.getOrderById(dto);
  }

  @Get('warehouse/:whId')
  async getOrdersByWhId(whId: number): Promise<OrderDto[] | null> {
    return this.orderQueryFacade.getOrdersByWhId(whId);
  }

  @Get()
  async listAllOrders(): Promise<OrderDto[]> {
    return this.orderQueryFacade.listAllOrders();
  }
}