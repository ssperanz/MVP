import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AbstractOrderEventHandler } from './abstract-order-event-handler.js';
import type { OrderEventDestinationWhPublisher } from '../ports/order-event-destination-wh-publisher.port.js';
import { OrderStateUpdatedEvent } from '../../../domain/order/events/order-state-updated.event.js';
import { OrderCreatedEvent } from 'src/core/domain/order/events/order-created.event.js';
import { OrderEvent } from 'src/shared/domain/events/order-event.base.js';

@EventsHandler(OrderStateUpdatedEvent)
export class OrderEventDestinationWhHandler extends AbstractOrderEventHandler implements IEventHandler<OrderEvent> {
  constructor(
    @Inject('IOrderEventDestinationWhPublisher')
    private readonly publisher: OrderEventDestinationWhPublisher,
  ) {
    super();
  }

  override async onOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.publisher.publishOrderCreated(event);
  }

  override async onOrderStateUpdated(event: OrderStateUpdatedEvent): Promise<void> {
    await this.publisher.publishOrderStateUpdated(event);
  }
}
