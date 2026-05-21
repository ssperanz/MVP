import { Query } from '@nestjs/cqrs';
import { ProductDto } from '../../dto/product.dto';

export class GetProductByWhIdQuery extends Query<ProductDto[] | null> {
  constructor(public readonly whId: number) {
    super();
  }
}
