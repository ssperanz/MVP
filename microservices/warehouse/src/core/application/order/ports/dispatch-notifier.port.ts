import { OrderDispatchedEvent } from "../events/order-dispatched.event";

export const IDispatchNotifierPortToken = Symbol('IDispatchNotifierPort');

export interface DispatchNotifierPort {
  notify(payload: any): Promise<void>;
}
