import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  OrderReadModelMongo,
} from '../../../src/infrastructure/persistence/mongodb/read-models/order-read-model.mongo.js';

import {
  OrderReadModelSchema,
  OrderReadModelDocument,
  OrderReadModelMongoSchema,
} from '../../../src/infrastructure/persistence/mongodb/schemas/order-read-model.schema.js';

import { OrderReadModel } from '../../../src/core/application/order/ports/order-read-model.repository.interface.js';

describe('OrderReadModelMongo - Integration', () => {
  let repository: OrderReadModelMongo;
  let model: Model<OrderReadModelDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost:27018/warehouse-test',
        ),
        MongooseModule.forFeature([
          {
            name: OrderReadModelSchema.name,
            schema: OrderReadModelMongoSchema,
          },
        ]),
      ],
      providers: [OrderReadModelMongo],
    }).compile();

    repository = module.get(OrderReadModelMongo);

    model = module.get<Model<OrderReadModelDocument>>(
      getModelToken(OrderReadModelSchema.name),
    );
  });

  beforeEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await model.deleteMany({});
    await model.db.close();
  });

  const createOrder = (): OrderReadModel => ({
    orderId: 'order-1',

    orderItems: [
      {
        productId: 'product-1',
        qty: 5,
        unitPrice: 10,
        totalValue: 50,
      },
    ],

    orderType: 'SELL',
    orderState: 'CREATED',
    orderCreationDate: new Date('2026-08-10T10:00:00Z'),
    departureWh: 1,
    totalOrderValue: 50,

    destination: {
      streetName: 'Via Roma',
      civicNumber: 10,
      city: 'Milano',
      cap: '20100',
      country: 'Italy',
    },
  });

  it('should upsert and find an order read model', async () => {
    const order = createOrder();

    await repository.upsert(order);

    const loaded = await repository.findById('order-1');

    expect(loaded).not.toBeNull();

    expect(loaded!.orderId).toBe(order.orderId);
    expect(loaded!.orderType).toBe(order.orderType);
    expect(loaded!.orderState).toBe(order.orderState);
    expect(loaded!.departureWh).toBe(order.departureWh);
    expect(loaded!.totalOrderValue).toBe(order.totalOrderValue);
    expect(loaded!.orderCreationDate).toEqual(order.orderCreationDate);

    expect(loaded!.orderItems).toEqual([
      {
        productId: 'product-1',
        qty: 5,
        unitPrice: 10,
        totalValue: 50,
      },
    ]);

    expect(loaded!.destination).toEqual({
      streetName: 'Via Roma',
      civicNumber: 10,
      city: 'Milano',
      cap: '20100',
      country: 'Italy',
    });
  });

  it('should return null when order does not exist', async () => {
    const loaded = await repository.findById('does-not-exist');

    expect(loaded).toBeNull();
  });

  it('should update an existing order read model', async () => {
    const order = createOrder();

    await repository.upsert(order);

    const updated: OrderReadModel = {
      ...order,
      orderState: 'VALIDATED',
      totalOrderValue: 100,
    };

    await repository.upsert(updated);

    const loaded = await repository.findById('order-1');

    expect(loaded).not.toBeNull();
    expect(loaded!.orderState).toBe('VALIDATED');
    expect(loaded!.totalOrderValue).toBe(100);
  });

  it('should return all order read models', async () => {
    const order1 = createOrder();

    const order2: OrderReadModel = {
      ...createOrder(),
      orderId: 'order-2',
    };

    await repository.upsert(order1);
    await repository.upsert(order2);

    const orders = await repository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders.map(o => o.orderId)).toEqual(
      expect.arrayContaining(['order-1', 'order-2']),
    );
  });
});