import { OrderApplicationEvent } from '../../../../shared/application/events/order-application-event';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo';

export class OrderValidatedEvent extends OrderApplicationEvent {
  constructor(public readonly orderId: OrderId) {
    super(orderId);
  }
}
