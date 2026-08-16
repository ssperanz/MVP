import { OrderApplicationEvent } from '../../../../shared/application/events/order-application-event';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo';

export class OrderReceivedEvent extends OrderApplicationEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly sourceWh: number,
    public readonly destinationWh: number,
  ) {
    super(orderId);
  }
}
