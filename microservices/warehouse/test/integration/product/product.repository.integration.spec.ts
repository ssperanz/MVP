import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Product as ProductSchema,
  ProductSchema as ProductMongooseSchema,
  ProductDocument,
} from '../../../src/infrastructure/persistence/mongodb/schemas/product.schema.js';

import { ProductRepositoryMongo } from '../../../src/infrastructure/persistence/mongodb/product.repository.mongo.js';

import { Product } from '../../../src/core/domain/product/entities/product.entity.js';
import { ProductId } from '../../../src/shared/domain/value-objects/product-id.vo.js';
import { Money } from '../../../src/shared/domain/value-objects/money.vo.js';
import { Quantity } from '../../../src/shared/domain/value-objects/quantity.vo.js';

describe('ProductRepositoryMongo - Integration', () => {
  let repository: ProductRepositoryMongo;
  let productModel: Model<ProductDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost:27018/warehouse-test',
        ),
        MongooseModule.forFeature([
          {
            name: ProductSchema.name,
            schema: ProductMongooseSchema,
          },
        ]),
      ],
      providers: [ProductRepositoryMongo],
    }).compile();

    repository = module.get(ProductRepositoryMongo);
    productModel = module.get<Model<ProductDocument>>(
      getModelToken(ProductSchema.name),
    );
  });

  beforeEach(async () => {
    await productModel.deleteMany({});
  });

  afterAll(async () => {
    await productModel.deleteMany({});

    const connection = productModel.db;
    await connection.close();
  });

  it('should save and load a product from MongoDB', async () => {
    const product = new Product(
      new ProductId('product-1'),
      'Product 1',
      new Money(10),
      new Quantity(100),
      new Quantity(0),
      new Quantity(10),
      new Quantity(200),
    );

    await repository.save(product);

    const loadedProduct = await repository.loadById(
      new ProductId('product-1'),
    );

    expect(loadedProduct).not.toBeNull();

    expect(loadedProduct!.getId().id).toBe('product-1');
    expect(loadedProduct!.getName()).toBe('Product 1');
    expect(loadedProduct!.getUnitPrice().getAmount()).toBe(10);
    expect(loadedProduct!.getAvailableQty().getValue).toBe(100);
    expect(loadedProduct!.getReservedQty().getValue).toBe(0);
    expect(loadedProduct!.getMinThres().getValue).toBe(10);
    expect(loadedProduct!.getMaxThres().getValue).toBe(200);
  });

  
  it('should return all products', async () => {
    const product1 = new Product(
      new ProductId('product-1'),
      'Product 1',
      new Money(10),
      new Quantity(100),
      new Quantity(0),
      new Quantity(10),
      new Quantity(200),
    );

    const product2 = new Product(
      new ProductId('product-2'),
      'Product 2',
      new Money(20),
      new Quantity(200),
      new Quantity(0),
      new Quantity(20),
      new Quantity(400),
    );

    await repository.save(product1);
    await repository.save(product2);

    const products = await repository.loadAll();

    expect(products).toHaveLength(2);
  });

  it('should return null when product does not exist', async () => {
    const loadedProduct = await repository.loadById(
      new ProductId('non-existent'),
    );

    expect(loadedProduct).toBeNull();
  });

  it('should delete a product', async () => {
    const product = new Product(
      new ProductId('product-1'),
      'Product 1',
      new Money(10),
      new Quantity(100),
      new Quantity(0),
      new Quantity(10),
      new Quantity(200),
    );

    await repository.save(product);
    await repository.delete(product.getId());

    const loadedProduct = await repository.loadById(product.getId());
    expect(loadedProduct).toBeNull();
  });

  it('should update an existing product', async () => {
    const product = new Product(
      new ProductId('product-1'),
      'Product 1',
      new Money(10),
      new Quantity(100),
      new Quantity(0),
      new Quantity(10),
      new Quantity(200),
    );

    await repository.save(product);

    const updatedProduct = new Product(
      product.getId(),
      'Updated Product 1',
      new Money(15),
      new Quantity(150),
      new Quantity(0),
      new Quantity(15),
      new Quantity(300),
    );

    await repository.save(updatedProduct);

    const loadedProduct = await repository.loadById(product.getId());
    expect(loadedProduct).not.toBeNull();

    expect(loadedProduct!.getId().id).toBe('product-1');
    expect(loadedProduct!.getName()).toBe('Updated Product 1');
    expect(loadedProduct!.getUnitPrice().getAmount()).toBe(15);
    expect(loadedProduct!.getAvailableQty().getValue).toBe(150);
    expect(loadedProduct!.getReservedQty().getValue).toBe(0);
    expect(loadedProduct!.getMinThres().getValue).toBe(15);
    expect(loadedProduct!.getMaxThres().getValue).toBe(300);
  });
});