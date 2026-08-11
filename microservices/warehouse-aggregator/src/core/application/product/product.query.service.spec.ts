import { QueryBus } from '@nestjs/cqrs';
import { ProductIdDto } from './dto/product-id.dto';
import { InventoryDto } from './dto/inventory.dto';
import { ProductDto } from './dto/product.dto';
import { ProductQueryUseCase } from './use-cases/product.query.usecase';
import { GetProductByProductIdQuery } from './use-cases/query/get-product-by-product-id.query';
import { GetInventoryQuery } from './use-cases/query/get-inventory.query';
import { GetProductByWhIdQuery } from './use-cases/query/get-product-by-wh-id.query';
import { ProductQueryService } from './product.query.service';

describe('ProductQueryService', () => {
  let productQueryService: ProductQueryService;
  let queryBusMock: QueryBus;

  beforeEach(() => {
    queryBusMock = {
      execute: jest.fn(),
    } as unknown as QueryBus;

    productQueryService = new ProductQueryService(queryBusMock);
  });

  it('should return a product by ID', async () => {
    const mockProduct = { id: '1', name: 'Product 1', price: 100 };
    (queryBusMock.execute as jest.Mock).mockResolvedValue(mockProduct);

    const result = await productQueryService.getProductById({ productId: '1' });

    expect(result).toEqual(expect.objectContaining({ id: '1', name: 'Product 1', price: 100 }));
  });

  it('should return products by warehouse ID', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];
    (queryBusMock.execute as jest.Mock).mockResolvedValue(mockProducts);

    const result = await productQueryService.getProductByWhId(1);

    expect(result).toEqual([
      expect.objectContaining({ id: '1', name: 'Product 1', price: 100 }),
      expect.objectContaining({ id: '2', name: 'Product 2', price: 200 }),
    ]);
  });

  it('should return an inventory of products', async () => {
    const mockInventory = { products: [{ id: '1', name: 'Product 1', price: 100 }] };
    (queryBusMock.execute as jest.Mock).mockResolvedValue(mockInventory);

    const result = await productQueryService.listProducts();

    expect(result).toEqual(expect.objectContaining({ products: [{ id: '1', name: 'Product 1', price: 100 }] }));
  });
});