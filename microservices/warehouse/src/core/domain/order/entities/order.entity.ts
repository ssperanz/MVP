import { AggregateRoot } from '@nestjs/cqrs';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../shared/domain/value-objects/order-item.vo.js';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum.js';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { Money } from '../../../../shared/domain/value-objects/money.vo.js';
import { OrderStateUpdatedEvent } from '../events/order-state-updated.event.js';

export class Order extends AggregateRoot {
  protected orderId: OrderId;
  protected orderItems: OrderItem[];
  protected orderType: OrderType;
  protected orderState: OrderState;
  protected orderCreationDate: Date;
  protected departureWh: WarehouseId;
  protected totalOrderValue: Money;

  constructor(
    orderId: OrderId,
    orderItems: OrderItem[],
    orderType: OrderType,
    orderState: OrderState,
    departureWh: WarehouseId,
    orderCreationDate?: Date,
  ) {
    super();
    this.orderId = orderId;
    this.orderItems = orderItems;
    this.orderType = orderType;
    this.orderState = orderState;
    this.departureWh = departureWh;
    this.orderCreationDate = orderCreationDate ?? new Date();
    this.totalOrderValue = this.updateTotal();
  }

  private updateTotal(): Money {
    return this.orderItems.reduce(
      (acc, item) => acc.increaseBy(item.getItemsTotalValue()),
      new Money(0),
    );
  }

  getOrderId(): OrderId { return this.orderId; }
  getOrderItems(): OrderItem[] { return this.orderItems; }
  getOrderType(): OrderType { return this.orderType; }
  getOrderState(): OrderState { return this.orderState; }
  getCreationDate(): Date { return this.orderCreationDate; }
  getWarehouseDeparture(): number { return this.departureWh.getId(); }
  getTotalOrderValue(): Money { return this.totalOrderValue; }

  protected updateOrderState(newOrderState: OrderState): OrderState {
    this.orderState = newOrderState;
    this.apply(
      new OrderStateUpdatedEvent(
        this.orderId,
        newOrderState,
        this.orderType,
      ),
    );
    return this.orderState;
  }

  setState(newOrderState: OrderState): OrderState {
    return this.updateOrderState(newOrderState);
  }

  markAsReserving(): void {
    this.updateOrderState(OrderState.RESERVING);
  }

  markAsReserved(): void {
    this.updateOrderState(OrderState.RESERVED);
  }

  markAsValidating(): void {
    this.updateOrderState(OrderState.VALIDATING);
  }

  markAsCanceling(): void {
    this.updateOrderState(OrderState.CANCELING);
  }

  markAsCanceled(): void {
    this.updateOrderState(OrderState.CANCELED);
  }

  markAsDispatching(): void {
    this.updateOrderState(OrderState.DISPATCHING);
  }

  markAsRestocking(): void {
    this.updateOrderState(OrderState.RESTOCKING);
  }

  markAsDispatched(): void {
    this.updateOrderState(OrderState.DISPATCHED);
  }

  markAsDelivered(): void {
    this.updateOrderState(OrderState.DELIVERED);
  }
}
