import { OrderApplicationEvent } from 'src/shared/application/events/order-application-event';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';

export class OrderValidationFailedEvent extends OrderApplicationEvent {
  private sourceWh: number;

  constructor(
    public readonly orderId: OrderId,
    public readonly insufficientItems: Array<{ productId: string; qty: number }>,
  ) {
    super(orderId);
  }
}
