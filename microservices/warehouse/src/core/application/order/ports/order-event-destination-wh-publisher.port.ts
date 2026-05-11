import { OrderEvent } from "src/shared/domain/events/order-event.base";

export const IOrderEventDestinationWhPublisherToken = Symbol('IOrderEventDestinationWhPublisher');

export interface OrderEventDestinationWhPublisher {
  publish(payload: any): Promise<void>;
}
