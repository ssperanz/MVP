import { QueryBus } from '@nestjs/cqrs';
import { ProductIdDto } from './dto/product-id.dto';
import { InventoryDto } from './dto/inventory.dto';
import { ProductDto } from './dto/product.dto';
import { ProductQueryUseCase } from './use-cases/product.query.usecase';
import { GetProductQuery } from './use-cases/query/get-product.query';
import { GetInventoryQuery } from './use-cases/query/get-inventory.query';


export class ProductQueryFacade implements ProductQueryUseCase {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  async getProductById(dto: ProductIdDto): Promise<ProductDto | null> {
    return this.queryBus.execute(new GetProductQuery(dto.productId));
  }

  async listProducts(): Promise<InventoryDto> {
    return this.queryBus.execute(new GetInventoryQuery());
  }

}