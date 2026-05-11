import { OrderValidationFailedEvent } from "../events/order-validation-failed.event";

export const IReplenishmentRequestPortToken = Symbol('IReplenishmentRequestPort');

export interface ReplenishmentRequestPort {
  requestReplenishment(payload: any): Promise<void>;
}
