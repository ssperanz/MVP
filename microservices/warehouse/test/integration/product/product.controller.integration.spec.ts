import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';

import { ProductModule } from '../../../src/core/application/product/product.module.js';
import {
  ProductReadModelSchema,
  ProductReadModelMongoSchema,
  ProductReadModelDocument,
} from '../../../src/infrastructure/persistence/mongodb/schemas/product-read-model.schema.js';

describe('ProductController - Integration', () => {
  let app: INestApplication;
  let productReadModel: Model<ProductReadModelDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost:27018/warehouse-test',
        ),
        ProductModule,
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    productReadModel = module.get<Model<ProductReadModelDocument>>(
      getModelToken(ProductReadModelSchema.name),
    );
  });

  afterEach(async () => {
    await productReadModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a product by id', async () => {
    const product = {
      productId: 'product-controller-1',
      name: 'Product 1',
      unitPrice: 10,
      availableQty: 100,
      reservedQty: 0,
      minThres: 10,
      maxThres: 200,
    };

    await productReadModel.create(product);

    const response = await request(app.getHttpServer())
      .get('/products/product-controller-1')
      .expect(200);

    expect(response.body).toMatchObject({
      productId: 'product-controller-1',
      name: 'Product 1',
      unitPrice: 10,
      availableQty: 100,
      reservedQty: 0,
      minThres: 10,
      maxThres: 200,
    });
  });

  it('should return 200 with null when product does not exist', async () => {
    const response = await request(app.getHttpServer())
      .get('/products/non-existing-product')
      .expect(200);

    expect(response.text).toBe('');
  });

  it('should return the inventory', async () => {
    const products = [
      {
        productId: 'product-1',
        name: 'Product 1',
        unitPrice: 10,
        availableQty: 100,
        reservedQty: 0,
        minThres: 10,
        maxThres: 200,
      },
      {
        productId: 'product-2',
        name: 'Product 2',
        unitPrice: 20,
        availableQty: 50,
        reservedQty: 5,
        minThres: 5,
        maxThres: 100,
      },
    ];

    await productReadModel.insertMany(products);

    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toMatchObject({
      products: [
        {
          productId: 'product-1',
          name: 'Product 1',
          unitPrice: 10,
          availableQty: 100,
          reservedQty: 0,
          minThres: 10,
          maxThres: 200,
        },
        {
          productId: 'product-2',
          name: 'Product 2',
          unitPrice: 20,
          availableQty: 50,
          reservedQty: 5,
          minThres: 5,
          maxThres: 100,
        },
      ],
    });
  });
});
