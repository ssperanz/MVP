import { ProductCreatedEvent } from "src/core/domain/product/events/product-created.event";
import { ProductRemovedEvent } from "src/core/domain/product/events/product-removed.event";
import { ProductEvent } from "src/shared/domain/events/product-event.base";

export const IProductEventCloudPublisherToken = Symbol('IProductEventCloudPublisher');

export interface ProductEventCloudPublisher {
  publishProductCreated(event: ProductCreatedEvent): Promise<void>;
  publishProductRemoved(event: ProductRemovedEvent): Promise<void>;
  publishProductUpdated(event: ProductEvent): Promise<void>;
}