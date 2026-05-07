import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductReservedQtyUpdatedEvent extends ProductEvent {
  constructor(productId: string, public readonly reservedQty: number) {
    super(productId);
  }
}
