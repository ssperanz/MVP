import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ProductReadModel,
  ProductReadModelMongoSchema,
} from '../../../src/infrastructure/persistence/mongodb/schemas/product-read-model.schema';

import { ProductReadModelRepositoryMongo } from '../../../src/infrastructure/persistence/mongodb/product-read-model.repository';

describe('ProductReadModelRepositoryMongo - Integration', () => {
  let repository: ProductReadModelRepositoryMongo;
  let model: Model<ProductReadModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost:27018/warehouse_product_test',
        ),
        MongooseModule.forFeature([
          {
            name: 'ProductReadModel',
            schema: ProductReadModelMongoSchema,
          },
        ]),
      ],
      providers: [
        ProductReadModelRepositoryMongo,
      ],
    }).compile();

    repository = module.get(ProductReadModelRepositoryMongo);

    model = module.get<Model<ProductReadModel>>(
      getModelToken('ProductReadModel'),
    );
  });

  beforeEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await model.db.dropDatabase();
    await model.db.close();
  });

  it('should return products by whId', async () => {
    await model.create({
      sourceWh: 1,
      productId: 'product-1',
      name: 'Product 1',
      unitPrice: 100,
      availableQty: 50,
      reservedQty: 10,
      minThres: 5,
      maxThres: 200,
    });

    const result = await repository.findByWhId(1);

    expect(result).toHaveLength(1);

    expect(result[0]).toEqual(
      expect.objectContaining({
        sourceWh: 1,
        productId: 'product-1',
        name: 'Product 1',
        unitPrice: 100,
        availableQty: 50,
        reservedQty: 10,
        minThres: 5,
        maxThres: 200,
      }),
    );
  });

  it('should return products by productId', async () => {
    await model.create({
      sourceWh: 1,
      productId: 'product-1',
      name: 'Product 1',
      unitPrice: 100,
      availableQty: 50,
      reservedQty: 10,
      minThres: 5,
      maxThres: 200,
    });

    const result = await repository.findByProductId('product-1');

    expect(result).toHaveLength(1);

    expect(result![0]).toEqual(
      expect.objectContaining({
        sourceWh: 1,
        productId: 'product-1',
        name: 'Product 1',
        unitPrice: 100,
        availableQty: 50,
        reservedQty: 10,
        minThres: 5,
        maxThres: 200,
      }),
    );
  });

  it('should return an empty array when product does not exist', async () => {
    const result = await repository.findByProductId('does-not-exist');

    expect(result).toEqual([]);
  });

  it('should upsert a product', async () => {
    const product = {
      sourceWh: 1,
      productId: 'product-1',
      name: 'Product 1',
      unitPrice: 100,
      availableQty: 50,
      reservedQty: 10,
      minThres: 5,
      maxThres: 200,
    };

    const sourceWh = 1;

    await repository.upsert(product, sourceWh);

    const result = await model.findOne({ productId: 'product-1' }).lean();

    expect(result).toEqual(
      expect.objectContaining({
        sourceWh: 1,
        productId: 'product-1',
        name: 'Product 1',
        unitPrice: 100,
        availableQty: 50,
        reservedQty: 10,
        minThres: 5,
        maxThres: 200,
      }),
    );
  });

  it('should update a product', async () => {
    await model.create({
      sourceWh: 1,
      productId: 'product-1',
      name: 'Product 1',
      unitPrice: 100,
      availableQty: 50,
      reservedQty: 10,
      minThres: 5,
      maxThres: 200,
    });

    const updatedProduct = {
      productId: 'product-1',
      name: 'Updated Product 1',
      unitPrice: 150,
      availableQty: 60,
      reservedQty: 5,
      minThres: 10,
      maxThres: 250,
    };

    const sourceWh = 1;

    await repository.update(updatedProduct, sourceWh);

    const result = await model.findOne({ productId: 'product-1' }).lean();

    expect(result).toEqual(
      expect.objectContaining({
        sourceWh: 1,
        productId: 'product-1',
        name: 'Updated Product 1',
        unitPrice: 150,
        availableQty: 60,
        reservedQty: 5,
        minThres: 10,
        maxThres: 250,
      }),
    );
  });

  it('should delete a product', async () => {
    await model.create({
      sourceWh: 1,
      productId: 'product-1',
      name: 'Product 1',
      unitPrice: 100,
      availableQty: 50,
      reservedQty: 10,
      minThres: 5,
      maxThres: 200,
    });

    await repository.delete({ productId: 'product-1' }, 1);

    const result = await model.findOne({ productId: 'product-1' }).lean();

    expect(result).toBeNull();
  });
});
