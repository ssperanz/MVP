import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';

export class ProductReleasedEvent extends ProductEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly productId: ProductId,
    public readonly qtyReleased: Quantity,
  ) {
    super(productId);
  }
}
