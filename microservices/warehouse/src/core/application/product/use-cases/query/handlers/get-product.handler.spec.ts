import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from '../get-product.query';
import type { ProductReadModel, ProductReadModelRepository } from '../../../ports/product-read-model.repository.interface';
import { ProductDto } from '../../../dto/product.dto';
import { GetProductQueryHandler } from './get-product.handler';

describe('GetProductQueryHandler', () => {
  let queryHandler: GetProductQueryHandler;
  let productReadModelMock: jest.Mocked<ProductReadModelRepository>;

  beforeEach(() => {
    productReadModelMock = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ProductReadModelRepository>;

    queryHandler = new GetProductQueryHandler(productReadModelMock);
  });

  it('should return a ProductDto when the product exists', async () => {
    const productId = 'product-1';
    const mockProductData = { productId: productId, name: 'Product 1' } as unknown as ProductReadModel;
    productReadModelMock.findById.mockResolvedValue(mockProductData);

    const query = new GetProductQuery(productId);
    const result = await queryHandler.execute(query);

    expect(result).toBeInstanceOf(ProductDto);
    expect(result?.productId).toBe(productId);
    expect(result?.name).toBe('Product 1');
  });

  it('should return null when the product does not exist', async () => {
    const productId = 'non-existent-product-id';
    productReadModelMock.findById.mockResolvedValue(null);

    const query = new GetProductQuery(productId);
    const result = await queryHandler.execute(query);

    expect(result).toBeNull();
  });
});