import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductNameUpdatedEvent extends ProductEvent {
  constructor(productId: ProductId, public readonly name: string) {
    super(productId);
  }
}
