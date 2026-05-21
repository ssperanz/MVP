import { Query } from '@nestjs/cqrs';
import { ProductDto } from '../../dto/product.dto';

export class GetProductByProductIdQuery extends Query<ProductDto[] | null> {
  constructor(public readonly productId: string) {
    super();
  }
}
