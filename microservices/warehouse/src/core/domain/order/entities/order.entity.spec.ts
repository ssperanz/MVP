import { AggregateRoot } from '@nestjs/cqrs';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../shared/domain/value-objects/order-item.vo.js';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum.js';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { Money } from '../../../../shared/domain/value-objects/money.vo.js';
import { OrderStateUpdatedEvent } from '../events/order-state-updated.event.js';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { Order } from './order.entity.js';

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

  it('should mark order as reserving', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    order.markAsReserving();
    expect(order.getOrderState()).toEqual(OrderState.RESERVING);
  });

  it('should mark order as reserved', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    order.markAsReserved();
    expect(order.getOrderState()).toEqual(OrderState.RESERVED);
  });

  it('should mark order as validating', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    order.markAsValidating();
    expect(order.getOrderState()).toEqual(OrderState.VALIDATING);
  });

  it('should mark order as canceling', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    order.markAsCanceling();
    expect(order.getOrderState()).toEqual(OrderState.CANCELING);
  });

  it('should mark order as canceled', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    order.markAsCanceled();
    expect(order.getOrderState()).toEqual(OrderState.CANCELED);
  });

  it('should mark order as dispatching', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    order.markAsDispatching();
    expect(order.getOrderState()).toEqual(OrderState.DISPATCHING);
  });

  it('should mark order as restocking', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    order.markAsRestocking();
    expect(order.getOrderState()).toEqual(OrderState.RESTOCKING);
  });

  it('should mark order as dispatched', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    order.markAsDispatched();
    expect(order.getOrderState()).toEqual(OrderState.DISPATCHED);
  });

  it('should mark order as delivered', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    order.markAsDelivered();
    expect(order.getOrderState()).toEqual(OrderState.DELIVERED);
  });

  it('should set order state directly', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    const newState = OrderState.CANCELED;
    order.setState(newState);
    expect(order.getOrderState()).toEqual(newState);
  });

  it('should return the creation date of the order', () => {
    const order = new Order(orderId, orderItems, orderType, orderState, departureWh);
    const creationDate = order.getCreationDate();
    expect(creationDate).toBeInstanceOf(Date);
  });

});