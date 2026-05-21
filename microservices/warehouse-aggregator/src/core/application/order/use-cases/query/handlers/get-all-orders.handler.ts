import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { GetAllOrdersQuery } from '../get-all-orders.query';
import type { OrderReadModelRepository } from '../../../ports/order-read-model.repository.interface';
import { OrderDto } from '../../../dto/order.dto';

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersQueryHandler implements IQueryHandler<GetAllOrdersQuery> {
  constructor(
    @Inject('IOrderReadModelRepository')
    private readonly orderReadModel: OrderReadModelRepository,
  ) {}

  async execute(query: GetAllOrdersQuery): Promise<OrderDto[]> {
    const results = await this.orderReadModel.findAll();
    return results.map(r => Object.assign(new OrderDto(), r));
  }
}
  