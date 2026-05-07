import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductDispatchedEvent extends ProductEvent {
  constructor(
    public readonly productId: string,
    public readonly qtyDispatched: number,
  ) {
    super(productId);
  }
}
