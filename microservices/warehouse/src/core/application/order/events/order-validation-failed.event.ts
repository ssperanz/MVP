import { OrderApplicationEvent } from '../../../../shared/application/events/order-application-event';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo';

export class OrderValidationFailedEvent extends OrderApplicationEvent {
  public readonly sourceWh: number;

  constructor(
    public readonly orderId: OrderId,
    public readonly insufficientItems: Array<{ productId: string; qty: number }>,
  ) {
    super(orderId);
  }
}
