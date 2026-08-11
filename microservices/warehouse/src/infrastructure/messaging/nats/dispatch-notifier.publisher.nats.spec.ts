import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { DispatchNotifierPort } from "src/core/application/order/ports/dispatch-notifier.port";
import { DispatchNotifierPublisherNats } from './dispatch-notifier.publisher.nats';

describe('DispatchNotifierPublisherNats', () => {
  let dispatchNotifierPublisherNats: DispatchNotifierPublisherNats;
  let natsClientMock: ClientProxy;

  beforeEach(() => {
    natsClientMock = {
      emit: jest.fn().mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(undefined),
      }),
    } as unknown as ClientProxy;

    dispatchNotifierPublisherNats = new DispatchNotifierPublisherNats(natsClientMock);
  });

  it('should notify with correct subject and payload', async () => {
    const orderId = '12345';
    const destWh = '2';

    await dispatchNotifierPublisherNats.notify({ orderId, destWh });

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${destWh}.order.incoming`,
      { orderId }
    );
  });
});