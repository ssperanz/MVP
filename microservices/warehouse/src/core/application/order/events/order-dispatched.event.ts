import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderApplicationEvent } from '../../../../shared/application/events/order-application-event.js';

export class OrderDispatchedEvent extends OrderApplicationEvent {
  
  constructor(
    public readonly orderId: OrderId,
    public readonly sourceWh: number,
    public readonly destinationWh?: number,
  ) {
    super(orderId);
  }
}
