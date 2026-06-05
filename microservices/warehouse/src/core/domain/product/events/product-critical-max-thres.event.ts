import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';

export class ProductCriticalMaxThresEvent extends ProductEvent {
  constructor(
    productId: ProductId,
    public readonly maxThres: Quantity,
    public readonly currentQty: Quantity,
  ) {
    super(productId);
  }
}
