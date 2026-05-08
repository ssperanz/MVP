import { OrderApplicationEvent } from 'src/shared/application/events/order-application-event.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';

export class OrderDeliveredEvent extends OrderApplicationEvent {
  constructor(public readonly orderId: OrderId) {
    super(orderId);
  }
}
