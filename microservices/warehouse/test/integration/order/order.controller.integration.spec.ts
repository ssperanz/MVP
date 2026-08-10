import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import request from 'supertest';

import {
  OrderReadModelSchema,
  OrderReadModelMongoSchema,
  OrderReadModelDocument,
} from '../../../src/infrastructure/persistence/mongodb/schemas/order-read-model.schema.js';

import { OrderReadModelMongo } from '../../../src/infrastructure/persistence/mongodb/read-models/order-read-model.mongo.js';
import { OrderModule } from 'src/core/application/order/order.module.js';

describe('OrderController - Integration', () => {
  let app: INestApplication;
  let orderReadModel: Model<OrderReadModelDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost:27018/warehouse-test',
        ),
        OrderModule,
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    orderReadModel = module.get<Model<OrderReadModelDocument>>(
      getModelToken(OrderReadModelSchema.name),
    );
  });

  afterEach(async () => {
    await orderReadModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an order by id', async () => {
    const order = {
      orderId: 'order-controller-1',
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
      orderCreationDate: new Date(),
      departureWh: 1,
      totalOrderValue: 50,
    };

    await orderReadModel.create(order);

    const response = await request(app.getHttpServer())
      .get('/orders/order-controller-1')
      .expect(200);

    expect(response.body).toMatchObject({
      orderId: 'order-controller-1',
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
      departureWh: 1,
      totalOrderValue: 50,
    });
  });

  it('should return 200 when order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders/non-existing-order')
      .expect(200);

    expect(response.text).toBe('');
  });

  it('should return all orders', async () => {
    const orders = [
      {
        orderId: 'order-controller-2',
        orderItems: [
          {
            productId: 'product-2',
            qty: 3,
            unitPrice: 15,
            totalValue: 45,
          },
        ],
        orderType: 'SELL',
        orderState: 'CREATED',
        orderCreationDate: new Date(),
        departureWh: 1,
        totalOrderValue: 45,
      },
      {
        orderId: 'order-controller-3',
        orderItems: [
          {
            productId: 'product-3',
            qty: 2,
            unitPrice: 20,
            totalValue: 40,
          },
        ],
        orderType: 'SELL',
        orderState: 'CREATED',
        orderCreationDate: new Date(),
        departureWh: 1,
        totalOrderValue: 40,
      },
    ];

    await orderReadModel.insertMany(orders);

    const response = await request(app.getHttpServer())
      .get('/orders')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ orderId: 'order-controller-2' }),
        expect.objectContaining({ orderId: 'order-controller-3' }),
      ]),
    );
  });
});