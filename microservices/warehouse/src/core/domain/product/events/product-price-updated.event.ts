import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductPriceUpdatedEvent extends ProductEvent {
  constructor(productId: string, public readonly unitPrice: number) {
    super(productId);
  }
}
