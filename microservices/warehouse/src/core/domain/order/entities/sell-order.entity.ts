import { Order } from './order.entity.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../shared/domain/value-objects/order-item.vo.js';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum.js';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { Address } from '../../../../shared/domain/value-objects/address.vo.js';
import { OrderCreatedEvent } from '../events/order-created.event.js';

export class SellOrder extends Order {
  private destination: Address;

  constructor(
    orderId: OrderId,
    orderItems: OrderItem[],
    orderType: OrderType,
    departureWh: WarehouseId,
    destination: Address,
    orderState: OrderState = OrderState.CREATED,
    orderCreationDate?: Date,
  ) {
    super(orderId, orderItems, orderType, orderState, departureWh, orderCreationDate);
    this.destination = destination;
  }

  static create(
    orderId: OrderId,
    orderItems: OrderItem[],
    orderType: OrderType,
    departureWh: WarehouseId,
    destination: Address,
  ): SellOrder {
    const order = new SellOrder(orderId, orderItems, orderType, departureWh, destination);
    order.apply(
      new OrderCreatedEvent(
        orderId,
        orderItems,
        departureWh,
        orderType,
        OrderState.CREATED,
        order.getTotalOrderValue(),
      ),
    );
    return order;
  }

  getDestination(): Address { return this.destination; }
}
