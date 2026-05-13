import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ProductDto } from '../../../dto/product.dto';
import { GetInventoryQuery } from '../get-inventory.query';
import type { ProductReadModelRepository } from '../../../ports/product-read-model.repository.interface';
import { InventoryDto } from '../../../dto/inventory.dto';

@QueryHandler(GetInventoryQuery)
export class GetInventoryQueryHandler implements IQueryHandler<GetInventoryQuery> {
  constructor(
    @Inject('IProductReadModelRepository')
    private readonly productReadModel: ProductReadModelRepository,
  ) {}

  async execute(query: GetInventoryQuery): Promise<InventoryDto> {
    const results = await this.productReadModel.findAll();
    const inventory = new InventoryDto();
    inventory.products = results.map(r => Object.assign(new ProductDto(), r));
    return inventory;
  }
}
  