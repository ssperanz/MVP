import { Query } from '@nestjs/cqrs';
import { ProductDto } from '../../dto/product.dto';

export class GetProductQuery extends Query<ProductDto> {
  constructor(public readonly productId: string) {
    super();
  }
}
