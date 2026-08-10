import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderValidationFailedEvent } from '../events/order-validation-failed.event.js';
import type { ReplenishmentRequestPort } from '../ports/replenishment-request.port.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { OrderValidationFailedHandler } from './order-validation-failed.handler.js';


describe('OrderValidationFailedHandler', () => {
  let replenishmentRequestPortMock: ReplenishmentRequestPort;
  let orderValidationFailedHandler: OrderValidationFailedHandler;

  beforeEach(() => {
    replenishmentRequestPortMock = {
      requestReplenishment: jest.fn(),
    };

    orderValidationFailedHandler = new OrderValidationFailedHandler(replenishmentRequestPortMock);
  });

  it('should call requestReplenishment with correct parameters', async () => {
    const event = new OrderValidationFailedEvent(
      new WarehouseId(1),
      { getId: () => 'order-123' } as any,
      [{ productId: 'product-1', qty: 10 }]
    );

    await orderValidationFailedHandler.handle(event);

    expect(replenishmentRequestPortMock.requestReplenishment).toHaveBeenCalledWith({
      sourceWh: new WarehouseId(1),
      orderId: 'order-123',
      insufficientItems: [{ productId: 'product-1', qty: 10}],
    });
  });
});