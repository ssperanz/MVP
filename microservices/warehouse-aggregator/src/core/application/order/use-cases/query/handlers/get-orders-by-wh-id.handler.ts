import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { OrderReadModelRepository } from '../../../ports/order-read-model.repository.interface';
import { GetOrderByIdQuery } from '../get-order-by-id.query';
import { OrderDto } from '../../../dto/order.dto';
import { GetOrdersByWhIdQuery } from '../get-orders-by-wh-id.query';

@QueryHandler(GetOrdersByWhIdQuery)
export class GetOrdersByWhIdQueryHandler implements IQueryHandler<GetOrdersByWhIdQuery> {
  constructor(
    @Inject('IOrderReadModelRepository')
    private readonly orderReadModel: OrderReadModelRepository,
  ) {}

  async execute(query: GetOrdersByWhIdQuery): Promise<OrderDto[] | null> {
    const result = await this.orderReadModel.findByWhId(query.whId);
    if (!result || result.length === 0) {
      return null;
    }
    return result.map((model) => Object.assign(new OrderDto(), model));
  }
}