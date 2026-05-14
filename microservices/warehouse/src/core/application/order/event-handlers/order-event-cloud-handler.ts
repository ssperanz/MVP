import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AbstractOrderEventHandler } from './abstract-order-event-handler.js';
import type { OrderEventCloudPublisher } from '../ports/order-event-cloud-publisher.port.js';
import { OrderCreatedEvent } from '../../../domain/order/events/order-created.event.js';
import { OrderStateUpdatedEvent } from '../../../domain/order/events/order-state-updated.event.js';
import { OrderEvent } from 'src/shared/domain/events/order-event.base.js';

@EventsHandler(OrderCreatedEvent, OrderStateUpdatedEvent)
export class OrderEventCloudHandler extends AbstractOrderEventHandler implements IEventHandler<OrderEvent> {
  constructor(
    @Inject('IOrderEventCloudPublisher')
    private readonly publisher: OrderEventCloudPublisher,
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
