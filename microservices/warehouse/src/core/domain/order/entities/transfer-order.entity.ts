import { Order } from './order.entity.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../shared/domain/value-objects/order-item.vo.js';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum.js';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { OrderCreatedEvent } from '../events/order-created.event.js';

export class TransferOrder extends Order {
  protected destinationWh: WarehouseId;

  constructor(
    orderId: OrderId,
    orderItems: OrderItem[],
    orderType: OrderType,
    departureWh: WarehouseId,
    destinationWh: WarehouseId,
    orderState: OrderState = OrderState.CREATED,
    orderCreationDate?: Date,
  ) {
    super(orderId, orderItems, orderType, orderState, departureWh, orderCreationDate);
    this.destinationWh = destinationWh;
  }

  static create(
    orderId: OrderId,
    orderItems: OrderItem[],
    orderType: OrderType,
    departureWh: WarehouseId,
    destinationWh: WarehouseId,
  ): TransferOrder {
    const order = new TransferOrder(orderId, orderItems, orderType, departureWh, destinationWh);
    order.apply(
      new OrderCreatedEvent(
        orderId.getId(),
        orderItems.map((i) => ({
          productId: i.getId().id,
          qty: i.getQty().getValue,
          unitPrice: i.getItemPrice().getAmount(),
        })),
        departureWh.getId(),
        orderType,
      ),
    );
    return order;
  }

  markAsReplenishing(): void {
    this.updateOrderState(OrderState.REPLENISHING);
  }

  getDestinationWh(): WarehouseId { return this.destinationWh; }
}
