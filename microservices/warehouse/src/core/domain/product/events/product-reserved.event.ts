import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductReservedEvent extends ProductEvent {
  constructor(
    public readonly productId: string,
    public readonly qtyReserved: number,
  ) {
    super(productId);
  }
}
