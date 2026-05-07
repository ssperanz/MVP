import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductMaxThresUpdatedEvent extends ProductEvent {
  constructor(productId: string, public readonly maxThres: number) {
    super(productId);
  }
}
