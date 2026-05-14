import { OrderEventPublisher } from "./order-event.publisher";

export const IOrderEventCloudPublisherToken = Symbol('IOrderEventCloudPublisher');

export interface OrderEventCloudPublisher extends OrderEventPublisher{}
