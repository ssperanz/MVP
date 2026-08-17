import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { connect, NatsConnection } from 'nats';

import { WarehouseAggregatorModule } from '../../../src/warehouse-aggregator.module';
import {
  ProductReadModel,
  ProductReadModelMongoSchema,
} from '../../../src/infrastructure/persistence/mongodb/schemas/product-read-model.schema';
import { Transport } from '@nestjs/microservices';

describe('ProductEventListenerNats - Integration', () => {
  let app: INestApplication;
  let model: Model<ProductReadModel>;
  let nc: NatsConnection;

  beforeAll(async () => {

  const module: TestingModule = await Test.createTestingModule({
    imports: [WarehouseAggregatorModule],
  }).compile();

  app = module.createNestApplication();

  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222'],
    },
  });

  await app.init();

  await app.startAllMicroservices();

  model = module.get<Model<ProductReadModel>>(
    getModelToken('ProductReadModel'),
  );

  nc = await connect({
    servers: 'nats://localhost:4222',
  });

}, 5000);

  beforeEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
  if (nc) {
    await nc.drain();
  }

  if (app) {
    await app.close();
  }
});

  it('should persist a product when a product.created event is received', async () => {
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

    nc.publish(
      'warehouse.1.product.created',
      JSON.stringify(product),
    );

    await nc.flush();

    await waitFor(async () => {
      const result = await model.findOne({
        productId: 'product-1',
        sourceWh: 1,
      });

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Product 1');
      expect(result?.unitPrice).toBe(100);
      expect(result?.availableQty).toBe(50);
      expect(result?.reservedQty).toBe(10);
    });
  });

  it('should update the product when a product.*.updated event is received', async () => {
    const initialProduct = {
      sourceWh: 1,
      productId: 'product-3',
      name: 'Product 3',
      unitPrice: 200,
      availableQty: 20,
      reservedQty: 2,
      minThres: 2,
      maxThres: 50,
    };

    await model.create(initialProduct);

    const updatedName = 'Updated Product 3';

    nc.publish(
      'warehouse.1.product.updated',
      JSON.stringify({ sourceWh: 1, productId: 'product-3', name: updatedName }),
    );

    await nc.flush();

    await waitFor(async () => {
      const result = await model.findOne({
        productId: 'product-3',
        sourceWh: 1,
      });

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Updated Product 3');
    });
  });

  it('should delete a product when a product.deleted event is received', async () => {
    const productToDelete = {
      sourceWh: 1,
      productId: 'product-4',
      name: 'Product 4',
      unitPrice: 300,
      availableQty: 15,
      reservedQty: 1,
      minThres: 1,
      maxThres: 30,
    };

    await model.create(productToDelete);

    nc.publish(
      'warehouse.1.product.deleted',
      JSON.stringify({ sourceWh: 1, productId: 'product-4' }),
    );

    await nc.flush();

    await waitFor(async () => {
      const result = await model.findOne({
        productId: 'product-4',
        sourceWh: 1,
      });

      expect(result).toBeNull();
    });
  });
});

async function waitFor(
  assertion: () => Promise<void>,
  timeout = 3000,
  interval = 50,
): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      await assertion();
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  await assertion();
}