import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  OrderReadModel,
  OrderReadModelMongoSchema,
} from '../../../src/infrastructure/persistence/mongodb/schemas/order-read-model.schema';

import { OrderReadModelRepositoryMongo } from '../../../src/infrastructure/persistence/mongodb/order-read-model.repository';

describe('OrderReadModelRepositoryMongo - Integration', () => {
  let repository: OrderReadModelRepositoryMongo;
  let model: Model<OrderReadModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost:27018/warehouse_order_test',
        ),
        MongooseModule.forFeature([
          {
            name: 'OrderReadModel',
            schema: OrderReadModelMongoSchema,
          },
        ]),
      ],
      providers: [
        OrderReadModelRepositoryMongo,
      ],
    }).compile();

    repository = module.get(OrderReadModelRepositoryMongo);
    model = module.get<Model<OrderReadModel>>(
      getModelToken('OrderReadModel'),
    );
  });

  beforeEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await model.db.dropDatabase();
    await model.db.close();
  });

  describe('findByOrderId', () => {
    it('should return an order by orderId', async () => {
      await model.create({
        sourceWh: 1,
        orderId: 'order-1',
        orderItems: [
          {
            productId: 'product-1',
            quantity: 2,
            unitPrice: 10,
          },
        ],
        orderType: 'TRANSFER',
        orderState: 'CREATED',
        orderCreationDate: new Date(),
        departureWh: 2,
        totalOrderValue: 20,
      });

      const result = await repository.findByOrderId('order-1');

      expect(result).not.toBeNull();
      expect(result?.orderId).toBe('order-1');
      expect(result?.sourceWh).toBe(1);
    });

    it('should return null when order does not exist', async () => {
      const result = await repository.findByOrderId('does-not-exist');

      expect(result).toBeNull();
    });

    it('should find all orders', async () => {
      await model.create({
        sourceWh: 1,
        orderId: 'order-1',
        orderItems: [
          {
            productId: 'product-1',
            quantity: 2,
            unitPrice: 10,
          },
        ],
        orderType: 'TRANSFER',
        orderState: 'CREATED',
        orderCreationDate: new Date(),
        departureWh: 2,
        totalOrderValue: 20,
      });

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
    });

    it('should upsert an order', async () => {
      const sourceWh = 1;
      const order = {
        orderId: 'order-1',
        orderItems: [
          {
            productId: 'product-1',
            quantity: 2,
            unitPrice: 10,
          },
        ],
        orderType: 'TRANSFER',
        orderState: 'CREATED',
        orderCreationDate: new Date(),
        departure: 2,
        totalOrderValue: 20,
      };

      await repository.upsert(order, sourceWh);

      const result = await repository.findByOrderId('order-1');

      expect(result).not.toBeNull();
    });

    it('should update the order state', async () => {
      let sourceWh = 1;
      await model.create({
        sourceWh: sourceWh,
        orderId: 'order-1',
        orderItems: [
          {
            productId: 'product-1',
            quantity: 2,
            unitPrice: 10,
          },
        ],
        orderType: 'TRANSFER',
        orderState: 'CREATED',
        orderCreationDate: new Date(),
        departureWh: 2,
        totalOrderValue: 20,
      });

      await repository.update(
        {
          orderId: 'order-1',
          orderState: 'VALIDATED',
        },
          sourceWh,
      );

      const result = await repository.findByOrderId('order-1');

      expect(result).not.toBeNull();
      expect(result?.orderState).toBe('VALIDATED');
    });
  });
});
