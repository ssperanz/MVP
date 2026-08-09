import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ProductDto } from '../../../dto/product.dto';
import { GetInventoryQuery } from '../get-inventory.query';
import type { ProductReadModel, ProductReadModelRepository } from '../../../ports/product-read-model.repository.interface';
import { InventoryDto } from '../../../dto/inventory.dto';
import { GetInventoryQueryHandler } from './get-inventory.handler';

describe('GetInventoryQueryHandler', () => {
  let queryHandler: GetInventoryQueryHandler;
  let productReadModelMock: jest.Mocked<ProductReadModelRepository>;

  beforeEach(() => {
    productReadModelMock = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ProductReadModelRepository>;

    queryHandler = new GetInventoryQueryHandler(productReadModelMock);
  });

  it('should return an InventoryDto with an array of ProductDto', async () => {
    const mockProductsData = [
      { productId: 'product-1', name: 'Product 1' },
      { productId: 'product-2', name: 'Product 2' },
    ] as unknown as ProductReadModel[];
    productReadModelMock.findAll.mockResolvedValue(mockProductsData);

    const query = new GetInventoryQuery();
    const result = await queryHandler.execute(query);

    expect(result).toBeInstanceOf(InventoryDto);
    expect(result.products).toHaveLength(2);
    expect(result.products[0]).toBeInstanceOf(ProductDto);
    expect(result.products[0].productId).toBe('product-1');
    expect(result.products[0].name).toBe('Product 1');
    expect(result.products[1]).toBeInstanceOf(ProductDto);
    expect(result.products[1].productId).toBe('product-2');
    expect(result.products[1].name).toBe('Product 2');
  });
});