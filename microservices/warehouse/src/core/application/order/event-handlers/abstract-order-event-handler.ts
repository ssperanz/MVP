import { OrderEvent } from 'src/shared/domain/events/order-event.base.js';
import { OrderCreatedEvent } from '../../../domain/order/events/order-created.event.js';
import { OrderStateUpdatedEvent } from '../../../domain/order/events/order-state-updated.event.js';

export abstract class AbstractOrderEventHandler {
  async handle(event: OrderEvent): Promise<void> {
    if (event instanceof OrderCreatedEvent) return this.onOrderCreated(event);
    if (event instanceof OrderStateUpdatedEvent) return this.onOrderStateUpdated(event);
  }

  protected async onOrderCreated(_e: OrderCreatedEvent): Promise<void> {}
  protected async onOrderStateUpdated(_e: OrderStateUpdatedEvent): Promise<void> {}
}
