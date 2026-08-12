import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum';
import { OrderEvent } from '../../../../shared/domain/events/order-event.base.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo';

export class OrderStateUpdatedEvent extends OrderEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly orderState: OrderState,
    public readonly orderType: OrderType,
    public readonly destinationWh?: WarehouseId,
  ) {
    super(orderId, orderState);
  }
}
