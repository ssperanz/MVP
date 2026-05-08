import { OrderApplicationEvent } from 'src/shared/application/events/order-application-event';
import { OrderState } from 'src/shared/domain/enums/order-state.enum';
import { OrderEvent } from 'src/shared/domain/events/order-event.base.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';

export class OrderValidationFailedEvent extends OrderApplicationEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly orderState: OrderState,
    public readonly insufficientItems: Array<{ productId: string; qty: number }>,
  ) {
    super(orderId);
  }
}
