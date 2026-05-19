import { Query } from '@nestjs/cqrs';
import { OrderDto } from '../../dto/order.dto';

export class GetOrderQuery extends Query<OrderDto | null> {
  constructor(public readonly orderId: string) {
    super();
  }
}
