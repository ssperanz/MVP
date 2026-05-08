import { TransferOrder } from './transfer-order.entity.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../shared/domain/value-objects/order-item.vo.js';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum.js';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { OrderCreatedEvent } from '../events/order-created.event.js';

export class ReplenishmentOrder extends TransferOrder {
  private orderReference: OrderId;

  constructor(
    orderId: OrderId,
    orderItems: OrderItem[],
    orderType: OrderType,
    departureWh: WarehouseId,
    destinationWh: WarehouseId,
    orderReference: OrderId,
    orderState: OrderState = OrderState.CREATED,
    orderCreationDate?: Date,
  ) {
    super(orderId, orderItems, orderType, departureWh, destinationWh, orderState, orderCreationDate);
    this.orderReference = orderReference;
  }

  static override create(
    orderId: OrderId,
    orderItems: OrderItem[],
    orderType: OrderType,
    departureWh: WarehouseId,
    destinationWh: WarehouseId,
    orderReference?: OrderId,
  ): ReplenishmentOrder {
    const order = new ReplenishmentOrder(
      orderId,
      orderItems,
      orderType,
      departureWh,
      destinationWh,
      orderReference!,
    );
    order.apply(
      new OrderCreatedEvent(
        orderId,
        orderItems.map((i) => ({
          productId: i.getId().id,
          qty: i.getQty().getValue,
          unitPrice: i.getItemPrice().getAmount(),
        })),
        departureWh,
        orderType,
        OrderState.CREATED,
      ),
    );
    return order;
  }

  getOrderReference(): OrderId { return this.orderReference; }
}
