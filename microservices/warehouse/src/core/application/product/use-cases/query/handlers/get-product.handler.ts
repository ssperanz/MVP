import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from '../get-product.query';
import type { ProductReadModelRepository } from '../../../ports/product-read-model.repository.interface';
import { ProductDto } from '../../../dto/product.dto';

@QueryHandler(GetProductQuery)
export class GetProductQueryHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @Inject('IProductReadModelRepository')
    private readonly productReadModel: ProductReadModelRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<ProductDto | null> {
    const result = await this.productReadModel.findById(query.productId);
    return result ? Object.assign(new ProductDto(), result) : null;
  }
}