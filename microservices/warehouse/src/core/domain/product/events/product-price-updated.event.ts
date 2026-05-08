import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';

export class ProductPriceUpdatedEvent extends ProductEvent {
  constructor(productId: ProductId, public readonly unitPrice: Money) {
    super(productId);
  }
}
  