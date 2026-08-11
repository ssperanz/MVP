import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderApplicationEvent } from '../../../../shared/application/events/order-application-event.js';

export class OrderDispatchFailedEvent extends OrderApplicationEvent {
  constructor(public readonly orderId: OrderId, public readonly reason: string) {
    super(orderId);
    this.reason = reason;
  }
}
