import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { OrderApplicationEvent } from 'src/shared/application/events/order-application-event';

export class OrderCanceledEvent extends OrderApplicationEvent {
  constructor(public readonly orderId: OrderId) {
    super(orderId);
  }
}
