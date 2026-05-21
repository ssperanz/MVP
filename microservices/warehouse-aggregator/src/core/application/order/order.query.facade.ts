import { QueryBus } from '@nestjs/cqrs';
import { OrderQueryUseCase } from './use-cases/order.usecase.query';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderDto } from './dto/order.dto';
import { GetOrderByIdQuery } from './use-cases/query/get-order-by-id.query';
import { GetAllOrdersQuery } from './use-cases/query/get-all-orders.query';
import { GetOrdersByWhIdQuery } from './use-cases/query/get-orders-by-wh-id.query';

export class OrderQueryFacade implements OrderQueryUseCase {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  async getOrderById(dto: OrderIdDto): Promise<OrderDto | null> {
    return this.queryBus.execute(new GetOrderByIdQuery(dto.orderId));
  }

  async getOrdersByWhId(whId: number): Promise<OrderDto[] | null> {
    return this.queryBus.execute(new GetOrdersByWhIdQuery(whId));
  }

  async listAllOrders(): Promise<OrderDto[]> {
    return this.queryBus.execute(new GetAllOrdersQuery());
  }

}