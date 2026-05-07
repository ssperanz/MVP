import { EventType } from 'src/shared/domain/enums/event-type.js';
import { DomainEvent } from './domain-event.base.js';

export abstract class ProductEvent extends DomainEvent {
  constructor(public readonly productId: string) {
    super();
    this.eventType = EventType.Product;
  }
}