import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AbstractOrderEventHandler } from './abstract-order-event-handler.js';
import type { OrderEventDestinationWhPublisher } from '../ports/order-event-destination-wh-publisher.port.js';
import { OrderStateUpdatedEvent } from '../../../domain/order/events/order-state-updated.event.js';
import { OrderCreatedEvent } from 'src/core/domain/order/events/order-created.event.js';
import { OrderEvent } from 'src/shared/domain/events/order-event.base.js';
import { OrderType } from 'src/shared/domain/enums/order-type.enum.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from 'src/shared/domain/value-objects/order-item.vo.js';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { OrderEventDestinationWhHandler } from './order-event-destination-wh-handler.js';

describe('OrderEventDestinationWhHandler', () => {
  let publisherMock: OrderEventDestinationWhPublisher;
  let orderEventDestinationWhHandler: OrderEventDestinationWhHandler;

  beforeEach(() => {
    publisherMock = {
      publishOrderCreated: jest.fn(),
      publishOrderStateUpdated: jest.fn(),
    };

    orderEventDestinationWhHandler = new OrderEventDestinationWhHandler(publisherMock);
  });

  it('should call publishOrderCreated with correct parameters', async () => {
    const event = new OrderCreatedEvent(
      new OrderId('order-123'),
      [new OrderItem(new ProductId('item-1'), new Quantity(2), new Money(10))],
      process.env.WAREHOUSE_ID ? new WarehouseId(Number(process.env.WAREHOUSE_ID)) : new WarehouseId(0),
      OrderType.SELL,
      OrderState.CREATED,
      new Money(10)
    );

    await orderEventDestinationWhHandler.onOrderCreated(event);

    expect(publisherMock.publishOrderCreated).toHaveBeenCalledWith(event);
  });

  it('should call publishOrderStateUpdated with correct parameters', async () => {
    const event = new OrderStateUpdatedEvent(
      new OrderId('order-123'),
      OrderState.RESERVING,
      OrderType.SELL,
    );

    await orderEventDestinationWhHandler.onOrderStateUpdated(event);

    expect(publisherMock.publishOrderStateUpdated).toHaveBeenCalledWith(event);
  });
});