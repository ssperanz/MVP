import { Injectable, Inject, Logger } from '@nestjs/common';
import type { OrderEventCloudPublisher } from '../../../core/application/order/ports/order-event-cloud-publisher.port.js';
import { ClientProxy } from '@nestjs/microservices';
import { OrderEventCloudPublisherNats } from './order-event-cloud.publisher.nats';
import { OrderCreatedEvent } from 'src/core/domain/order/events/order-created.event.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { OrderType } from 'src/shared/domain/enums/order-type.enum.js';
import { OrderItem } from 'src/shared/domain/value-objects/order-item.vo.js';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';

describe('OrderEventCloudPublisherNats', () => {
  let orderEventCloudPublisherNats: OrderEventCloudPublisherNats;
  let natsClientMock: ClientProxy;

  beforeEach(() => {
    natsClientMock = {
      emit: jest.fn().mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(undefined),
      }),
    } as unknown as ClientProxy;

    orderEventCloudPublisherNats = new OrderEventCloudPublisherNats(natsClientMock);
  });

  it('should publish order created event with correct subject and payload', async () => {
    const orderId = new OrderId('12345');
    const event = new OrderCreatedEvent(
      orderId,
      [new OrderItem(new ProductId('prod1'), new Quantity(2), new Money(10))],
      new WarehouseId(1),
      OrderType.TRANSFER,
      OrderState.CREATED,
      new Money(20),
      new WarehouseId(2),
    );
    await orderEventCloudPublisherNats.publishOrderCreated(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.order.created`,
      { 
        orderId: orderId.getId(),
        orderType: event.orderType.toString(),
        orderItems: event.orderItems.map(item => ({
          productId: item.getId().id,
          quantity: item.getQty().getValue,
        })),
        departureWh: event.departure.getId(),
        destinationWh: event.destinationWh?.getId(),
        orderReference: event.orderReference?.getId(),
        destinationAddress: event.destinationAddress? {
          streetName: event.destinationAddress.streetName,
          civicNumber: event.destinationAddress.civicNumber,
          city: event.destinationAddress.city,
          cap: event.destinationAddress.cap,
          country: event.destinationAddress.country,
        } : undefined,
      }
    );
  });

  it('should publish order state updated event with correct subject and payload', async () => {
    const orderId = new OrderId('12345');
    const event = new OrderCreatedEvent(
      orderId,
      [new OrderItem(new ProductId('prod1'), new Quantity(2), new Money(10))],
      new WarehouseId(1),
      OrderType.TRANSFER,
      OrderState.CREATED,
      new Money(20),
      new WarehouseId(2),
    );
    await orderEventCloudPublisherNats.publishOrderStateUpdated(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.order.state.updated`,
      { orderId: orderId.getId(), orderState: event.orderState.toString() }
    );
  });
});