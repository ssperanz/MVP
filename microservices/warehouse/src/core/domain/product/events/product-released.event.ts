import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductReleasedEvent extends ProductEvent {
  constructor(
    public readonly productId: string,
    public readonly qtyReleased: number,
  ) {
    super(productId);
  }
}
