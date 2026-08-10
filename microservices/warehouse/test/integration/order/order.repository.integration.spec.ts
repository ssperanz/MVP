import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderRepositoryMongo } from '../../../src/infrastructure/persistence/mongodb/order.repository.mongo';
import {
  OrderSchema,
  OrderMongoSchema,
  OrderDocument,
} from '../../../src/infrastructure/persistence/mongodb/schemas/order.schema';

import { SellOrder } from '../../../src/core/domain/order/entities/sell-order.entity.js';
import { OrderId } from '../../../src/shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../src/shared/domain/value-objects/order-item.vo.js';
import { ProductId } from '../../../src/shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../src/shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../src/shared/domain/value-objects/money.vo.js';
import { WarehouseId } from '../../../src/shared/domain/value-objects/warehouse-id.vo.js';
import { Address } from '../../../src/shared/domain/value-objects/address.vo.js';
import { OrderType } from '../../../src/shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../src/shared/domain/enums/order-state.enum.js';
import { TransferOrder } from '../../../src/core/domain/order/entities/transfer-order.entity';
import { ReplenishmentOrder } from '../../../src/core/domain/order/entities/replenishment-order.entity';

describe('OrderRepositoryMongo - Integration', () => {
  let repository: OrderRepositoryMongo;
  let orderModel: Model<OrderDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost:27018/warehouse-test',
        ),
        MongooseModule.forFeature([
          {
            name: OrderSchema.name,
            schema: OrderMongoSchema,
          },
        ]),
      ],
      providers: [OrderRepositoryMongo],
    }).compile();

    repository = module.get<OrderRepositoryMongo>(
      OrderRepositoryMongo,
    );

    orderModel = module.get<Model<OrderDocument>>(
      `${OrderSchema.name}Model`,
    );
  });

  beforeEach(async () => {
    await orderModel.deleteMany({});
  });

  afterAll(async () => {
    await orderModel.deleteMany({});
    await orderModel.db.close();
  });

  it('should save and load a SellOrder from MongoDB', async () => {
    const orderId = new OrderId('order-sell-1');

    const orderItems = [
      new OrderItem(
        new ProductId('product-1'),
        new Quantity(2),
        new Money(10),
      ),
    ];

    const departureWh = new WarehouseId(1);

    const destination = new Address(
      'Via Roma',
      10,
      'Milano',
      '20100',
      'Italy',
    );

    const order = new SellOrder(
      orderId,
      orderItems,
      OrderType.SELL,
      departureWh,
      destination,
      OrderState.CREATED,
    );

    await repository.save(order);

    const loaded = await repository.load(orderId);

    expect(loaded).toBeInstanceOf(SellOrder);

    expect(loaded?.getOrderId()).toEqual(orderId);
    expect(loaded?.getOrderItems()).toEqual(orderItems);
    expect(loaded?.getOrderType()).toBe(OrderType.SELL);
    expect(loaded?.getOrderState()).toBe(OrderState.CREATED);
    expect(loaded?.getWarehouseDeparture()).toBe(
      departureWh.getId(),
    );

    expect(loaded).toBeInstanceOf(SellOrder);

    const sellOrder = loaded as SellOrder;

    expect(sellOrder.getDestination()).toEqual(destination);
  });

  it('should save and load a TransferOrder from MongoDB', async () => {
    const orderId = new OrderId('order-transfer-1');

    const orderItems = [
      new OrderItem(
        new ProductId('product-1'),
        new Quantity(2),
        new Money(10),
      ),
    ];

    const departureWh = new WarehouseId(1);
    const destinationWh = new WarehouseId(2);

    const order = new TransferOrder(
      orderId,
      orderItems,
      OrderType.TRANSFER,
      departureWh,
      destinationWh,
      OrderState.CREATED,
    );

    await repository.save(order);

    const loaded = await repository.load(orderId);

    expect(loaded).toBeInstanceOf(TransferOrder);

    expect(loaded?.getOrderId()).toEqual(orderId);
    expect(loaded?.getOrderItems()).toEqual(orderItems);
    expect(loaded?.getOrderType()).toBe(OrderType.TRANSFER);
    expect(loaded?.getOrderState()).toBe(OrderState.CREATED);
    expect(loaded?.getWarehouseDeparture()).toBe(
      departureWh.getId(),
    );

    const transferOrder = loaded as TransferOrder;

    expect(transferOrder.getDestinationWh()).toEqual(
      destinationWh,
    );
  });

  it('should save and load a ReplenishmentOrder from MongoDB', async () => {
    const orderId = new OrderId('order-replenishment-1');

    const orderItems = [
      new OrderItem(
        new ProductId('product-1'),
        new Quantity(2),
        new Money(10),
      ),
    ];

    const departureWh = new WarehouseId(1);
    const destinationWh = new WarehouseId(2);
    const orderReference = new OrderId('order-ref-1');

    const order = new ReplenishmentOrder(
      orderId,
      orderItems,
      OrderType.REPLENISHMENT,
      departureWh,
      destinationWh,
      orderReference,
      OrderState.CREATED,
    );

    await repository.save(order);

    const loaded = await repository.load(orderId);

    expect(loaded).toBeInstanceOf(ReplenishmentOrder);

    expect(loaded?.getOrderId()).toEqual(orderId);
    expect(loaded?.getOrderItems()).toEqual(orderItems);
    expect(loaded?.getOrderType()).toBe(OrderType.REPLENISHMENT);
    expect(loaded?.getOrderState()).toBe(OrderState.CREATED);
    expect(loaded?.getWarehouseDeparture()).toBe(
      departureWh.getId(),
    );

    const replenishmentOrder = loaded as ReplenishmentOrder;

    expect(replenishmentOrder.getDestinationWh()).toEqual(
      destinationWh,
    );
    expect(replenishmentOrder.getOrderReference()).toEqual(
      orderReference,
    );
  });

  it('should return all orders', async () => {
    const order1 = new SellOrder(
      new OrderId('order-sell-1'),
      [
        new OrderItem(
          new ProductId('product-1'),
          new Quantity(2),
          new Money(10),
        ),
      ],
      OrderType.SELL,
      new WarehouseId(1),
      new Address('Via Roma', 10, 'Milano', '20100', 'Italy'),
      OrderState.CREATED,
    );

    const order2 = new TransferOrder(
      new OrderId('order-transfer-1'),
      [
        new OrderItem(
          new ProductId('product-2'),
          new Quantity(1),
          new Money(20),
        ),
      ],
      OrderType.TRANSFER,
      new WarehouseId(1),
      new WarehouseId(2),
      OrderState.CREATED,
    );

    await repository.save(order1);
    await repository.save(order2);

    const orders = await repository.loadAll();

    expect(orders).toHaveLength(2);
  });

  it('should return null when order does not exist', async () => {
    const loadedOrder = await repository.load(
      new OrderId('non-existent'),
    );

    expect(loadedOrder).toBeNull();
  });

  it('should update an existing order', async () => {
    const order = new SellOrder(
      new OrderId('order-sell-1'),
      [
        new OrderItem(
          new ProductId('product-1'),
          new Quantity(2),
          new Money(10),
        ),
      ],
      OrderType.SELL,
      new WarehouseId(1),
      new Address('Via Roma', 10, 'Milano', '20100', 'Italy'),
      OrderState.CREATED,
    );

    await repository.save(order);

    order['updateOrderState'](OrderState.CANCELED);

    await repository.save(order);

    const loadedOrder = await repository.load(order.getOrderId());

    expect(loadedOrder?.getOrderState()).toBe(OrderState.CANCELED);
  });

});