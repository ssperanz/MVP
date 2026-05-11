import { OrderEvent } from "src/shared/domain/events/order-event.base";

export const IOrderEventCloudPublisherToken = Symbol('IOrderEventCloudPublisher');

export interface OrderEventCloudPublisher {
  publish(payload: any): Promise<void>;
}
