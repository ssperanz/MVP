import { ProductCreatedEvent } from "src/core/domain/product/events/product-created.event";
import { ProductDispatchedEvent } from "src/core/domain/product/events/product-dispatched.event";
import { ProductMinThresUpdatedEvent } from "src/core/domain/product/events/product-min-thres-updated.event";
import { ProductMaxThresUpdatedEvent } from "src/core/domain/product/events/product-max-thres-updated.event";
import { ProductReceivedEvent } from "src/core/domain/product/events/product-received.event";
import { ProductReleasedEvent } from "src/core/domain/product/events/product-released.event";
import { ProductRemovedEvent } from "src/core/domain/product/events/product-removed.event";
import { ProductReservedEvent } from "src/core/domain/product/events/product-reserved.event";
import { ProductReservedQtyUpdatedEvent } from "src/core/domain/product/events/product-reserved-qty-updated.event";
import { ProductAvailableQtyUpdatedEvent } from "src/core/domain/product/events/product-available-qty-updated.event";
import { ProductPriceUpdatedEvent } from "src/core/domain/product/events/product-price-updated.event";
import { ProductNameUpdatedEvent } from "src/core/domain/product/events/product-name-updated.event";

export const IProductEventCloudPublisherToken = Symbol('IProductEventCloudPublisher');

export interface ProductEventCloudPublisher {
  publishProductCreated(event: ProductCreatedEvent): Promise<void>;
  publishProductRemoved(event: ProductRemovedEvent): Promise<void>;
  publishProducNameUpdate(event: ProductNameUpdatedEvent): Promise<void>
  publishProductPriceUpdate(event: ProductPriceUpdatedEvent): Promise<void>
  publishProductAvailableQtyUpdate(event: ProductAvailableQtyUpdatedEvent): Promise<void>
  publishProductReservedQtyUpdate(event: ProductReservedQtyUpdatedEvent): Promise<void>
  publishProductMinThresUpdate(event: ProductMinThresUpdatedEvent): Promise<void>
  publishProductMaxThresUpdate(event: ProductMaxThresUpdatedEvent): Promise<void>
  publishProductReserved(event: ProductReservedEvent): Promise<void>;
  publishProductReleased(event: ProductReleasedEvent): Promise<void>;
  publishProductDispatched(event: ProductDispatchedEvent): Promise<void>;
  publishProductReceived(event: ProductReceivedEvent): Promise<void>;
}