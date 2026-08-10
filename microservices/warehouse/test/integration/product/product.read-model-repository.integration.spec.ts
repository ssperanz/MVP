import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ProductReadModelMongo,
} from '../../../src/infrastructure/persistence/mongodb/read-models/product-read-model.mongo.js';

import {
  ProductReadModelDocument,
  ProductReadModelSchema,
  ProductReadModelMongoSchema,
} from '../../../src/infrastructure/persistence/mongodb/schemas/product-read-model.schema.js';

import { ProductReadModel } from '../../../src/core/application/product/ports/product-read-model.repository.interface.js';

describe('ProductReadModelMongo - Integration', () => {
  let repository: ProductReadModelMongo;
  let model: Model<ProductReadModelDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost:27018/warehouse-test',
        ),
        MongooseModule.forFeature([
          {
            name: ProductReadModelSchema.name,
            schema: ProductReadModelMongoSchema,
          },
        ]),
      ],
      providers: [ProductReadModelMongo],
    }).compile();

    repository = module.get(ProductReadModelMongo);

    model = module.get<Model<ProductReadModelDocument>>(
      getModelToken(ProductReadModelSchema.name),
    );
  });

  beforeEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await model.deleteMany({});
    await model.db.close();
  });

  const createProduct = (): ProductReadModel => ({
    productId: 'product-1',
    name: 'Product 1',
    unitPrice: 10,
    availableQty: 100,
    reservedQty: 20,
    minThres: 10,
    maxThres: 200,
  });

  it('should upsert and find a product read model', async () => {
    const product = createProduct();

    await repository.upsert(product);

    const loaded = await repository.findById('product-1');

    expect(loaded).not.toBeNull();

    expect(loaded!.productId).toBe('product-1');
    expect(loaded!.name).toBe('Product 1');
    expect(loaded!.unitPrice).toBe(10);
    expect(loaded!.availableQty).toBe(100);
    expect(loaded!.reservedQty).toBe(20);
    expect(loaded!.minThres).toBe(10);
    expect(loaded!.maxThres).toBe(200);
  });

  it('should return null when product does not exist', async () => {
    const loaded = await repository.findById('does-not-exist');

    expect(loaded).toBeNull();
  });

  it('should update an existing product read model', async () => {
    const product = createProduct();

    await repository.upsert(product);

    const updated: ProductReadModel = {
      ...product,
      name: 'Updated Product',
      availableQty: 50,
      reservedQty: 40,
    };

    await repository.upsert(updated);

    const loaded = await repository.findById('product-1');

    expect(loaded).not.toBeNull();
    expect(loaded!.name).toBe('Updated Product');
    expect(loaded!.availableQty).toBe(50);
    expect(loaded!.reservedQty).toBe(40);
  });

  it('should return all product read models', async () => {
    const product1 = createProduct();

    const product2: ProductReadModel = {
      ...createProduct(),
      productId: 'product-2',
      name: 'Product 2',
    };

    await repository.upsert(product1);
    await repository.upsert(product2);

    const products = await repository.findAll();

    expect(products).toHaveLength(2);
    expect(products.map(p => p.productId)).toEqual(
      expect.arrayContaining(['product-1', 'product-2']),
    );
  });

  it('should delete a product read model', async () => {
    const product = createProduct();

    await repository.upsert(product);

    expect(await repository.findById('product-1')).not.toBeNull();

    await repository.delete('product-1');

    const loaded = await repository.findById('product-1');

    expect(loaded).toBeNull();
  });
});