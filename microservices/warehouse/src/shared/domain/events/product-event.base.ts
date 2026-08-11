import { EventType } from '../../../shared/domain/enums/event-type.enum.js';
import { DomainEvent } from './domain-event.base.js';
import { ProductId } from '../value-objects/product-id.vo.js';

export abstract class ProductEvent extends DomainEvent {
  constructor(public readonly productId: ProductId) {
    super();
    this.eventType = EventType.Product;
  }
}