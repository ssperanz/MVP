import { OrderDispatchedEvent } from "../events/order-dispatched.event";

export const IDeliverNotifierPortToken = Symbol('IDeliverNotifierPort');

export interface DeliverNotifierPort {
  notify(payload: any): Promise<void>;
}
