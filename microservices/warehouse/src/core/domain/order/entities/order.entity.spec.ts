import { AggregateRoot } from '@nestjs/cqrs';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../shared/domain/value-objects/order-item.vo.js';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum.js';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { Money } from '../../../../shared/domain/value-objects/money.vo.js';
import { OrderStateUpdatedEvent } from '../events/order-state-updated.event.js';
import { Order } from './order.entity.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';

describe('Order Entity', () => {
  let orderId: OrderId;
  let orderItems: OrderItem[];
  let orderType: OrderType;
  let orderState: OrderState;
  let departureWh: WarehouseId;

  beforeEach(() => {
    orderId = new OrderId('order-123');
    orderItems = [
      new OrderItem(new ProductId('product-1'), new Quantity(2), new Money(10)),
      new OrderItem(new ProductId('product-2'), new Quantity(1), new Money(20)),
    ];
    orderType = OrderType.SELL;
    orderState = OrderState.CREATED;
    departureWh = new WarehouseId(1);
  });

  it('should create an order with correct properties', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);

    expect(order.getOrderId()).toEqual(orderId);
    expect(order.getOrderItems()).toEqual(orderItems);
    expect(order.getOrderType()).toEqual(orderType);
    expect(order.getOrderState()).toEqual(orderState);
    expect(order.getWarehouseDeparture()).toEqual(departureWh.getId());
    expect(order.getTotalOrderValue()).toEqual(new Money(40)); // 2*10 + 1*20
  });

  it('should update order state and emit event', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    const newState = OrderState.CANCELED;

    order['updateOrderState'](newState);

    expect(order.getOrderState()).toEqual(newState);

    const events = order.getUncommittedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(OrderStateUpdatedEvent);
  });
});