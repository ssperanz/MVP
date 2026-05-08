import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';

export class ProductAvailableQtyUpdatedEvent extends ProductEvent {
  constructor(productId: ProductId, public readonly availableQty: Quantity) {
    super(productId);
  }
}
