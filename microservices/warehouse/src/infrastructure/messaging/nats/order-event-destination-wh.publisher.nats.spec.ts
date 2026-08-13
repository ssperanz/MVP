import { Injectable, Inject, Logger } from '@nestjs/common';
import type { OrderEventDestinationWhPublisher } from '../../../core/application/order/ports/order-event-destination-wh-publisher.port.js';
import { OrderCreatedEvent } from 'src/core/domain/order/events/order-created.event.js';
import { OrderStateUpdatedEvent } from 'src/core/domain/order/events/order-state-updated.event.js';
import { ClientProxy } from '@nestjs/microservices';
import { OrderType } from 'src/shared/domain/enums/order-type.enum.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { Order } from 'src/core/domain/order/entities/order.entity.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { OrderItem } from 'src/shared/domain/value-objects/order-item.vo.js';
import { OrderEventDestinationWhPublisherNats } from './order-event-destination-wh.publisher.nats.js';

describe('OrderEventDestinationWhPublisherNats', () => {
  let orderEventDestinationWhPublisherNats: OrderEventDestinationWhPublisherNats;
  let natsClientMock: ClientProxy;

  beforeEach(() => {
    natsClientMock = {
      emit: jest.fn().mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(undefined),
      }),
    } as unknown as ClientProxy;

    orderEventDestinationWhPublisherNats = new OrderEventDestinationWhPublisherNats(natsClientMock);
  });

  it('should publish order created event with correct subject and payload', async () => {
    const event = new OrderCreatedEvent(
      new OrderId('12345'), [
        new OrderItem(new ProductId('prod1'), new Quantity(2), new Money(10)),
        new OrderItem(new ProductId('prod2'), new Quantity(3), new Money(15)),
      ],
      new WarehouseId(1),
      OrderType.TRANSFER,
      OrderState.DISPATCHING,
      new Money(100),
      new WarehouseId(2),
    );
    await orderEventDestinationWhPublisherNats.publishOrderCreated(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.mirror.2.order.created`,
      {
        orderId: event.orderId,
        items: [
          { productId: 'prod1', qty: 2 },
          { productId: 'prod2', qty: 3 },
        ],
      }
    );
  });

  it('should publish order state updated event with correct subject and payload', async () => {
    const event = new OrderStateUpdatedEvent(new OrderId('12345'), OrderState.DELIVERED, OrderType.SELL, new WarehouseId(2));
    await orderEventDestinationWhPublisherNats.publishOrderStateUpdated(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.mirror.2.order.state.updated`,
      {
        orderId: event.orderId,
        newState: event.orderState,
      }
    );
  });
});