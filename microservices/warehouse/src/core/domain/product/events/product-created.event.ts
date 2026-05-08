import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';

export class ProductCreatedEvent extends ProductEvent {
  constructor(
    public readonly productId: ProductId,
    public readonly name: string,
    public readonly unitPrice: Money,
    public readonly availableQty: Quantity,
    public readonly reservedQty: Quantity,
    public readonly minThres: Quantity,
    public readonly maxThres: Quantity,
  ) {
    super(productId);
  }
}