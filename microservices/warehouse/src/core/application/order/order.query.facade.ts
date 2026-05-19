import { QueryBus } from '@nestjs/cqrs';
import { OrderQueryUseCase } from './use-cases/order.usecase.query';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderDto } from './dto/order.dto';
import { GetOrderQuery } from './use-cases/query/get-order.query';
import { GetAllOrdersQuery } from './use-cases/query/get-all-orders.query';

export class OrderQueryFacade implements OrderQueryUseCase {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  async getOrderById(dto: OrderIdDto): Promise<OrderDto | null> {
    return this.queryBus.execute(new GetOrderQuery(dto.orderId));
  }

  async listOrders(): Promise<OrderDto[]> {
    return this.queryBus.execute(new GetAllOrdersQuery());
  }

}