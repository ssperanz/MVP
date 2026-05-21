import { Query } from '@nestjs/cqrs';

export class GetAllOrdersQuery extends Query<any[]> {
  constructor() {
    super();
  }
}
