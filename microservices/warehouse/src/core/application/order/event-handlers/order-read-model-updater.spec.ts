import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AbstractOrderEventHandler } from './abstract-order-event-handler.js';
import type { OrderReadModelRepository } from '../ports/order-read-model.repository.interface.js';
import { OrderCreatedEvent } from '../../../domain/order/events/order-created.event.js';
import { OrderStateUpdatedEvent } from '../../../domain/order/events/order-state-updated.event.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { OrderItem } from 'src/shared/domain/value-objects/order-item.vo.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { OrderType } from 'src/shared/domain/enums/order-type.enum.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';
import { OrderReadModelUpdater } from './order-read-model-updater.js';

describe('OrderReadModelUpdater', () => {
  let orderReadModelMock: OrderReadModelRepository;
  let orderReadModelUpdater: OrderReadModelUpdater;

  beforeEach(() => {
    orderReadModelMock = {
      upsert: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    orderReadModelUpdater = new OrderReadModelUpdater(orderReadModelMock);
  });

  it('should call upsert with correct parameters on OrderCreatedEvent', async () => {
    const event = new OrderCreatedEvent(
      new OrderId('order-123'),
      [new OrderItem(new ProductId('item-1'), new Quantity(2), new Money(10))],
      process.env.WAREHOUSE_ID ? new WarehouseId(Number(process.env.WAREHOUSE_ID)) : new WarehouseId(0),
      OrderType.SELL,
      OrderState.CREATED,
      new Money(10)
    );

    await orderReadModelUpdater.onOrderCreated(event);

    expect(orderReadModelMock.upsert).toHaveBeenCalledWith({
      orderId: 'order-123',
      orderItems: [
        {
          productId: 'item-1',
          qty: 2,
          unitPrice: 10,
          totalValue: 20,
        },
      ],
      orderType: OrderType.SELL,
      orderState: 'CREATED',
      orderCreationDate: event.occurredOn,
      departureWh: process.env.WAREHOUSE_ID ? Number(process.env.WAREHOUSE_ID) : 0,
      totalOrderValue: 10,
    });
  });

  it('should call upsert with updated state on OrderStateUpdatedEvent', async () => {
    const existingOrder = {
      orderId: 'order-123',
      orderItems: [],
      orderType: OrderType.SELL,
      orderState: 'CREATED',
      orderCreationDate: new Date(),
      departureWh: process.env.WAREHOUSE_ID ? Number(process.env.WAREHOUSE_ID) : 0,
      totalOrderValue: 10,
    };

    (orderReadModelMock.findById as jest.Mock).mockResolvedValue(existingOrder);

    const event = new OrderStateUpdatedEvent(
      new OrderId('order-123'),
      OrderState.RESERVING,
      OrderType.SELL,
    );

    await orderReadModelUpdater.onOrderStateUpdated(event);

    expect(orderReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingOrder,
      orderState: OrderState.RESERVING,
    });
  });
});
