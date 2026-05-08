import { OrderState } from 'src/shared/domain/enums/order-state.enum';
import { OrderType } from 'src/shared/domain/enums/order-type.enum';
import { OrderEvent } from 'src/shared/domain/events/order-event.base.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';

export class OrderStateUpdatedEvent extends OrderEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly orderState: OrderState,
    public readonly orderType: OrderType,
  ) {
    super(orderId, orderState);
  }
}
