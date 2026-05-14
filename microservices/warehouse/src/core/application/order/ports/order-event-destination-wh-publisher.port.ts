import { OrderEventPublisher } from "./order-event.publisher";

export const IOrderEventDestinationWhPublisherToken = Symbol('IOrderEventDestinationWhPublisher');

export interface OrderEventDestinationWhPublisher extends OrderEventPublisher {}
