import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';

export class ProductDispatchedEvent extends ProductEvent {
  constructor(
    public readonly orderId: string,
    public readonly productId: ProductId,
    public readonly qtyDispatched: Quantity,
  ) {
    super(productId);
  }
}
  