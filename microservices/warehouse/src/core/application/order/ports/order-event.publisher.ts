import { OrderCreatedEvent } from "src/core/domain/order/events/order-created.event";
import { OrderStateUpdatedEvent } from "src/core/domain/order/events/order-state-updated.event";

export interface OrderEventPublisher {
  publishOrderCreated(event: OrderCreatedEvent): Promise<void>;
  publishOrderStateUpdated(event: OrderStateUpdatedEvent): Promise<void>;
}
