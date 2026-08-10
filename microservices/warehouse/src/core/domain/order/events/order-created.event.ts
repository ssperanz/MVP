import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { OrderType } from 'src/shared/domain/enums/order-type.enum.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';
import { OrderEvent } from 'src/shared/domain/events/order-event.base.js';
import { Money } from 'src/shared/domain/value-objects/money.vo';
import { OrderItem } from 'src/shared/domain/value-objects/order-item.vo';

export class OrderCreatedEvent extends OrderEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly orderItems: OrderItem[],
    public readonly departure: WarehouseId,
    public readonly orderType: OrderType,
    public readonly orderState: OrderState,
    public readonly totalOrderValue: Money,
    public readonly destination?: WarehouseId,
  ) {
    super(orderId, orderState);
  }
}
