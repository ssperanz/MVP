import { DomainEvent } from '../../../../shared/domain/events/domain-event.base.js';

export class ProductsReservedEvent extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly itemsReserved: Array<{ productId: string; qty: number }>,
  ) {
    super();
  }
}
