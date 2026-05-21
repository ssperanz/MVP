import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductByProductIdQuery } from '../get-product-by-product-id.query';
import type { ProductReadModelRepository } from '../../../ports/product-read-model.repository.interface';
import { ProductDto } from '../../../dto/product.dto';

@QueryHandler(GetProductByProductIdQuery)
export class GetProductByProductIdQueryHandler implements IQueryHandler<GetProductByProductIdQuery> {
  constructor(
    @Inject('IProductReadModelRepository')
    private readonly productReadModel: ProductReadModelRepository,
  ) {}

  async execute(query: GetProductByProductIdQuery): Promise<ProductDto[] | null> {
    const productReadModels = await this.productReadModel.findByProductId(query.productId);
    if (!productReadModels || productReadModels.length === 0) {
      return null;
    }
    return productReadModels.map((model) => Object.assign(new ProductDto(), model));
  }
}