import { ProductEvent } from '../../../../shared/domain/events/product-event.base.js';

export class ProductMinThresUpdatedEvent extends ProductEvent {
  constructor(productId: string, public readonly minThres: number) {
    super(productId);
  }
}
