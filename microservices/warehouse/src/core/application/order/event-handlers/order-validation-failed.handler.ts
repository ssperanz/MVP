import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderValidationFailedEvent } from '../events/order-validation-failed.event.js';
import type { ReplenishmentRequestPort } from '../ports/replenishment-request.port.js';
import type { OrderRepository } from '../ports/order.repository.interface.js';

@EventsHandler(OrderValidationFailedEvent)
export class OrderValidationFailedHandler implements IEventHandler<OrderValidationFailedEvent> {
  constructor(
    @Inject('IReplenishmentRequestPort')
    private readonly replenishmentRequestPort: ReplenishmentRequestPort,
  ) {}

  async handle(event: OrderValidationFailedEvent): Promise<void> {
    await this.replenishmentRequestPort.requestReplenishment(
      {
        orderId: event.orderId.getId(),
        sourceWh: event.sourceWh,
        insufficientItems: event.insufficientItems,
      }
    );
  }
}
