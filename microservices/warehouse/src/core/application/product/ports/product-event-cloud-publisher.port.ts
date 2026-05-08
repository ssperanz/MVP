import { ProductEvent } from "src/shared/domain/events/product-event.base";

export const IProductEventCloudPublisherToken = Symbol('IProductEventCloudPublisher');

export interface ProductEventCloudPublisher {
  publish(event: ProductEvent): Promise<void>;
}