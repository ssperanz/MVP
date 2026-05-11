import { Query } from '@nestjs/cqrs';

export class GetInventoryQuery extends Query<any[]> {
  constructor() {
    super();
  }
}
