import { Injectable, Inject, Logger } from '@nestjs/common';
import type { OrderEventCloudPublisher } from '../../../core/application/order/ports/order-event-cloud-publisher.port.js';
import { ClientProxy } from '@nestjs/microservices';
import { OrderEventCloudPublisherNats } from './order-event-cloud.publisher.nats';

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
    const payload = { orderId: '12345' };
    await orderEventCloudPublisherNats.publishOrderCreated(payload);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.order.created`,
      payload
    );
  });

  it('should publish order state updated event with correct subject and payload', async () => {
    const payload = { orderId: '12345', newState: 'DELIVERED' };
    await orderEventCloudPublisherNats.publishOrderStateUpdated(payload);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.order.state.updated`,
      payload
    );
  });
});