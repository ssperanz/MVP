import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductNameUpdatedEvent extends ProductEvent {
  constructor(productId: string, public readonly name: string) {
    super(productId);
  }
}
