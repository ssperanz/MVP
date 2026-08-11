import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductByProductIdQuery } from '../get-product-by-product-id.query';
import type { ProductReadModelRepository } from '../../../ports/product-read-model.repository.interface';
import { ProductDto } from '../../../dto/product.dto';
import { GetProductByProductIdQueryHandler } from './get-product-by-product-id.handler';

describe('GetProductByProductIdQueryHandler', () => {
  let queryHandler: GetProductByProductIdQueryHandler;
  let productReadModelMock: ProductReadModelRepository;

  beforeEach(() => {
    productReadModelMock = {
      findByProductId: jest.fn(),
    } as unknown as ProductReadModelRepository;

    queryHandler = new GetProductByProductIdQueryHandler(productReadModelMock);
  });

  it('should return null if no products are found', async () => {
    (productReadModelMock.findByProductId as jest.Mock).mockResolvedValue(null);

    const result = await queryHandler.execute(new GetProductByProductIdQuery('nonexistent-id'));

    expect(result).toBeNull();
  });

  it('should return an array of ProductDto if products are found', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];
    (productReadModelMock.findByProductId as jest.Mock).mockResolvedValue(mockProducts);

    const result = await queryHandler.execute(new GetProductByProductIdQuery('existing-id'));

    expect(result).toEqual([
      expect.objectContaining({ id: '1', name: 'Product 1', price: 100 }),
      expect.objectContaining({ id: '2', name: 'Product 2', price: 200 }),
    ]);
  });
});