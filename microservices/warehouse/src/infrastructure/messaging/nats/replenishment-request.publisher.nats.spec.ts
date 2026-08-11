import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ReplenishmentRequestPort } from '../../../core/application/order/ports/replenishment-request.port.js';
import { ClientProxy } from '@nestjs/microservices';
import { ReplenishmentRequestPublisherNats } from './replenishment-request.publisher.nats.js';

describe('ReplenishmentRequestPublisherNats', () => {
  let replenishmentRequestPublisherNats: ReplenishmentRequestPublisherNats;
  let natsClientMock: ClientProxy;

  beforeEach(() => {
    natsClientMock = {
      emit: jest.fn().mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(undefined),
      }),
    } as unknown as ClientProxy;

    replenishmentRequestPublisherNats = new ReplenishmentRequestPublisherNats(natsClientMock);
  });

  it('should publish replenishment request with correct subject and payload', async () => {
    const orderId = '12345';
    const insufficientItems = [
      { productId: 'prod1', qty: 5 },
      { productId: 'prod2', qty: 10 },
    ];

    await replenishmentRequestPublisherNats.requestReplenishment({ orderId, insufficientItems });

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.replenishment.request`,
      { orderId, insufficientItems }
    );
  });
});