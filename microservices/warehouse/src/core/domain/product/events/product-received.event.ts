import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductReceivedEvent extends ProductEvent {
  constructor(
    public readonly productId: string,
    public readonly qtyReceived: number,
  ) {
    super(productId);
  }
}
