import { EventType } from 'src/shared/domain/enums/event-type.js';
import { DomainEvent } from './domain-event.base.js';
import { OrderId } from '../value-objects/order-id.vo.js';
import { OrderState } from '../enums/order-state.enum.js';

export abstract class OrderEvent extends DomainEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly orderState: OrderState,
  ) {
    super();
    this.eventType = EventType.Order;
  }
}