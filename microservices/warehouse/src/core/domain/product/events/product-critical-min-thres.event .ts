import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';

export class ProductCriticalMinThresEvent extends ProductEvent {
  constructor(
    productId: ProductId,
    public readonly minThres: Quantity,
    public readonly currentQty: Quantity,
  ) {
    super(productId);
  }
}
