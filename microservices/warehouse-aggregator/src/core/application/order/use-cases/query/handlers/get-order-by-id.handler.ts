import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { OrderReadModelRepository } from '../../../ports/order-read-model.repository.interface';
import { GetOrderByIdQuery } from '../get-order-by-id.query';
import { OrderDto } from '../../../dto/order.dto';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderQueryHandler implements IQueryHandler<GetOrderByIdQuery> {
  constructor(
    @Inject('IOrderReadModelRepository')
    private readonly orderReadModel: OrderReadModelRepository,
  ) {}

  async execute(query: GetOrderByIdQuery): Promise<OrderDto | null> {
    const result = await this.orderReadModel.findById(query.orderId);
    return result ? Object.assign(new OrderDto(), result) : null;
  }
}