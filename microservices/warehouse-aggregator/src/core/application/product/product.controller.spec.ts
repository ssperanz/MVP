import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { ProductIdDto } from './dto/product-id.dto';
import { ProductDto } from './dto/product.dto';
import { ProductQueryService } from './product.query.service';
import { InventoryDto } from './dto/inventory.dto';
import { ProductController } from './product.controller';

describe('ProductController', () => {
  let productController: ProductController;
  let productQueryServiceMock: Partial<ProductQueryService>;

  beforeEach(() => {
    productQueryServiceMock = {
      getProductById: jest.fn(),
      getProductByWhId: jest.fn(),
      listProducts: jest.fn(),
    };

    productController = new ProductController(productQueryServiceMock as ProductQueryService);
  });

  it('should return a product by ID', async () => {
    const mockProduct = { id: '1', name: 'Product 1', price: 100 };
    (productQueryServiceMock.getProductById as jest.Mock).mockResolvedValue(mockProduct);

    const result = await productController.getProductById({ productId: '1' });

    expect(result).toEqual(expect.objectContaining({ id: '1', name: 'Product 1', price: 100 }));
  });

  it('should return products by warehouse ID', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];
    (productQueryServiceMock.getProductByWhId as jest.Mock).mockResolvedValue(mockProducts);

    const result = await productController.getProductByWhId(1);

    expect(result).toEqual([
      expect.objectContaining({ id: '1', name: 'Product 1', price: 100 }),
      expect.objectContaining({ id: '2', name: 'Product 2', price: 200 }),
    ]);
  });

  it('should return an inventory of products', async () => {
    const mockInventory = { products: [{ id: '1', name: 'Product 1', price: 100 }] };
    (productQueryServiceMock.listProducts as jest.Mock).mockResolvedValue(mockInventory);

    const result = await productController.getInventory();

    expect(result).toEqual(expect.objectContaining({ products: [{ id: '1', name: 'Product 1', price: 100 }] }));
  });
});