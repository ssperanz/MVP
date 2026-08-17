import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { DispatchNotifierPort } from "src/core/application/order/ports/dispatch-notifier.port";
import { DispatchNotifierPublisherNats } from './dispatch-notifier.publisher.nats';
import { OrderDispatchedEvent } from "../../../core/application/order/events/order-dispatched.event";
import { OrderType } from "../../../shared/domain/enums/order-type.enum";
import { OrderId } from "../../../shared/domain/value-objects/order-id.vo";

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
    const sourceWh = 1;
    const destWh = 2;

    await dispatchNotifierPublisherNats.notify(
      new OrderDispatchedEvent(
        new OrderId(orderId),
        OrderType.TRANSFER,
        [],
        sourceWh,
        destWh,
      ),
    );

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${sourceWh}.transfer.${destWh}.order.dispatched`,
      {
        orderId,
        orderType: OrderType.TRANSFER,
        items: [],
        sourceWh,
        destinationWh: destWh,
      },
    );
  });
});