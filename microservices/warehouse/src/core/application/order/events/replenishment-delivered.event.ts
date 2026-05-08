import { OrderApplicationEvent } from 'src/shared/application/events/order-application-event.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';

export class ReplenishmentDeliveredEvent extends OrderApplicationEvent {
  constructor(public readonly replenishmentId: OrderId, public readonly orderReference: OrderId) {
    super(replenishmentId);
    this.orderReference = orderReference;
  }
}
