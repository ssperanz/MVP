import { QueryBus } from '@nestjs/cqrs';
import { ProductIdDto } from './dto/product-id.dto';
import { InventoryDto } from './dto/inventory.dto';
import { ProductDto } from './dto/product.dto';
import { ProductQueryUseCase } from './use-cases/product.query.usecase';
import { GetProductQuery } from './use-cases/query/get-product.query';
import { GetInventoryQuery } from './use-cases/query/get-inventory.query';
import { Injectable } from '@nestjs/common';
import { ProductQueryService } from './product.query.service';

describe('ProductQueryService', () => {
  let productQueryService: ProductQueryService;
  let queryBus: QueryBus;

  beforeEach(async () => {
    queryBus = {
      execute: jest.fn(),
    } as unknown as QueryBus;

    productQueryService = new ProductQueryService(queryBus);
  });

  it('should be defined', () => {
    expect(productQueryService).toBeDefined();
  });

  it('should call queryBus.execute with GetProductQuery when getProductById is called', async () => {
    const productIdDto: ProductIdDto = { productId: '123' };
    await productQueryService.getProductById(productIdDto);
    expect(queryBus.execute).toHaveBeenCalledWith(new GetProductQuery('123'));
  });

  it('should call queryBus.execute with GetInventoryQuery when listProducts is called', async () => {
    await productQueryService.listProducts();
    expect(queryBus.execute).toHaveBeenCalledWith(new GetInventoryQuery());
  });
});