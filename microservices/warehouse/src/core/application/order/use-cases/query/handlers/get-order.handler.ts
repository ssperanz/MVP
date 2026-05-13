import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { OrderReadModelRepository } from '../../../ports/order-read-model.repository.interface';
import { GetOrderQuery } from '../get-order.query';
import { OrderDto } from '../../../dto/order.dto';

@QueryHandler(GetOrderQuery)
export class GetOrderQueryHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    @Inject('IOrderReadModelRepository')
    private readonly orderReadModel: OrderReadModelRepository,
  ) {}

  async execute(query: GetOrderQuery): Promise<OrderDto | null> {
    const result = await this.orderReadModel.findById(query.orderId);
    return result ? Object.assign(new OrderDto(), result) : null;
  }
}