import { Query } from '@nestjs/cqrs';
import { OrderDto } from '../../dto/order.dto';

export class GetOrdersByWhIdQuery extends Query<OrderDto[] | null> {
  constructor(public readonly whId: number) {
    super();
  }
}
