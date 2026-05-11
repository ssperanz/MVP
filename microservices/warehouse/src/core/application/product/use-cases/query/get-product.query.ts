import { Query } from '@nestjs/cqrs';

export class GetProductQuery extends Query<any> {
  constructor(public readonly productId: string) {
    super();
  }
}
