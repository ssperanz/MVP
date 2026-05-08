import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductRemovedEvent extends ProductEvent {
  constructor(public readonly productId: ProductId) {
    super(productId);
  }
}
