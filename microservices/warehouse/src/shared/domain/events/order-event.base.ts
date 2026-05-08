import { EventType } from 'src/shared/domain/enums/event-type.js';
import { DomainEvent } from './domain-event.base.js';
import { OrderId } from '../value-objects/order-id.vo.js';

export abstract class OrderEvent extends DomainEvent {
  constructor(public readonly orderId: OrderId) {
    super();
    this.eventType = EventType.Order;
  }
}