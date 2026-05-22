import { QueryBus } from '@nestjs/cqrs';
import { ProductIdDto } from './dto/product-id.dto';
import { InventoryDto } from './dto/inventory.dto';
import { ProductDto } from './dto/product.dto';
import { ProductQueryUseCase } from './use-cases/product.query.usecase';
import { GetProductByProductIdQuery } from './use-cases/query/get-product-by-product-id.query';
import { GetInventoryQuery } from './use-cases/query/get-inventory.query';
import { GetProductByWhIdQuery } from './use-cases/query/get-product-by-wh-id.query';


export class ProductQueryService implements ProductQueryUseCase {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  async getProductById(dto: ProductIdDto): Promise<ProductDto[] | null> {
    return this.queryBus.execute(new GetProductByProductIdQuery(dto.productId));
  }

  async getProductByWhId(whId: number): Promise<ProductDto[] | null> {
    return this.queryBus.execute(new GetProductByWhIdQuery(whId));
  }

  async listProducts(): Promise<InventoryDto> {
    return this.queryBus.execute(new GetInventoryQuery());
  }

}