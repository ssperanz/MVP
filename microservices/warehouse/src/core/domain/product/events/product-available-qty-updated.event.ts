import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductAvailableQtyUpdatedEvent extends ProductEvent {
  constructor(productId: string, public readonly availableQty: number) {
    super(productId);
  }
}
