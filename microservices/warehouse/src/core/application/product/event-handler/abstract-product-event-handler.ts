import { ProductCreatedEvent } from '../../../domain/product/events/product-created.event.js';
import { ProductRemovedEvent } from '../../../domain/product/events/product-removed.event.js';
import { ProductNameUpdatedEvent } from '../../../domain/product/events/product-name-updated.event.js';
import { ProductPriceUpdatedEvent } from '../../../domain/product/events/product-price-updated.event.js';
import { ProductAvailableQtyUpdatedEvent } from '../../../domain/product/events/product-available-qty-updated.event.js';
import { ProductReservedQtyUpdatedEvent } from '../../../domain/product/events/product-reserved-qty-updated.event.js';
import { ProductMinThresUpdatedEvent } from '../../../domain/product/events/product-min-thres-updated.event.js';
import { ProductMaxThresUpdatedEvent } from '../../../domain/product/events/product-max-thres-updated.event.js';
import { ProductReservedEvent } from '../../../domain/product/events/product-reserved.event.js';
import { ProductReleasedEvent } from '../../../domain/product/events/product-released.event.js';
import { ProductDispatchedEvent } from '../../../domain/product/events/product-dispatched.event.js';
import { ProductReceivedEvent } from '../../../domain/product/events/product-received.event.js';
import { ProductEvent } from 'src/shared/domain/events/product-event.base.js';

export abstract class AbstractProductEventHandler {
  async handle(event: ProductEvent): Promise<void> {
    if (event instanceof ProductCreatedEvent) return this.onProductCreated(event);
    if (event instanceof ProductRemovedEvent) return this.onProductRemoved(event);
    if (event instanceof ProductNameUpdatedEvent) return this.onNameUpdated(event);
    if (event instanceof ProductPriceUpdatedEvent) return this.onPriceUpdated(event);
    if (event instanceof ProductAvailableQtyUpdatedEvent) return this.onAvailableQtyUpdated(event);
    if (event instanceof ProductReservedQtyUpdatedEvent) return this.onReservedQtyUpdated(event);
    if (event instanceof ProductMinThresUpdatedEvent) return this.onMinThresUpdated(event);
    if (event instanceof ProductMaxThresUpdatedEvent) return this.onMaxThresUpdated(event);
    if (event instanceof ProductReservedEvent) return this.onProductReserved(event);
    if (event instanceof ProductReleasedEvent) return this.onProductReleased(event);
    if (event instanceof ProductDispatchedEvent) return this.onProductDispatched(event);
    if (event instanceof ProductReceivedEvent) return this.onProductReceived(event);
  }

  protected async onProductCreated(_e: ProductCreatedEvent): Promise<void> {}
  protected async onProductRemoved(_e: ProductRemovedEvent): Promise<void> {}
  protected async onNameUpdated(_e: ProductNameUpdatedEvent): Promise<void> {}
  protected async onPriceUpdated(_e: ProductPriceUpdatedEvent): Promise<void> {}
  protected async onAvailableQtyUpdated(_e: ProductAvailableQtyUpdatedEvent): Promise<void> {}
  protected async onReservedQtyUpdated(_e: ProductReservedQtyUpdatedEvent): Promise<void> {}
  protected async onMinThresUpdated(_e: ProductMinThresUpdatedEvent): Promise<void> {}
  protected async onMaxThresUpdated(_e: ProductMaxThresUpdatedEvent): Promise<void> {}
  protected async onProductReserved(_e: ProductReservedEvent): Promise<void> {}
  protected async onProductReleased(_e: ProductReleasedEvent): Promise<void> {}
  protected async onProductDispatched(_e: ProductDispatchedEvent): Promise<void> {}
  protected async onProductReceived(_e: ProductReceivedEvent): Promise<void> {}
}
