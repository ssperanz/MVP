import { Query } from '@nestjs/cqrs';

export class GetOrderQuery extends Query<any> {
  constructor(public readonly orderId: string) {
    super();
  }
}
