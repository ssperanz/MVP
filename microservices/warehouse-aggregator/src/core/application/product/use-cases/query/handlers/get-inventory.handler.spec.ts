import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ProductDto } from '../../../dto/product.dto';
import { GetInventoryQuery } from '../get-inventory.query';
import type { ProductReadModelRepository } from '../../../ports/product-read-model.repository.interface';
import { InventoryDto } from '../../../dto/inventory.dto';
import { GetInventoryQueryHandler } from './get-inventory.handler';
  
describe('GetInventoryQueryHandler', () => {
  let queryHandler: GetInventoryQueryHandler;
  let productReadModelMock: ProductReadModelRepository;

  beforeEach(() => {
    productReadModelMock = {
      findAll: jest.fn(),
    } as unknown as ProductReadModelRepository;

    queryHandler = new GetInventoryQueryHandler(productReadModelMock);
  });

  it('should return an empty inventory if no products are found', async () => {
    (productReadModelMock.findAll as jest.Mock).mockResolvedValue([]);

    const result = await queryHandler.execute(new GetInventoryQuery());

    expect(result).toEqual({ products: [] });
  });

  it('should return an inventory with products if products are found', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];
    (productReadModelMock.findAll as jest.Mock).mockResolvedValue(mockProducts);

    const result = await queryHandler.execute(new GetInventoryQuery());

    expect(result).toEqual({
      products: [
        expect.objectContaining({ id: '1', name: 'Product 1', price: 100 }),
        expect.objectContaining({ id: '2', name: 'Product 2', price: 200 }),
      ],
    });
  });
});