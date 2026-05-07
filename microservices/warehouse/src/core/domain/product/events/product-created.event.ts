import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductCreatedEvent extends ProductEvent {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly unitPrice: number,
    public readonly availableQty: number,
    public readonly reservedQty: number,
    public readonly minThres: number,
    public readonly maxThres: number,
  ) {
    super(productId);
  }
}