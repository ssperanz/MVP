import { Order } from './order.entity.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../shared/domain/value-objects/order-item.vo.js';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum.js';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { OrderCreatedEvent } from '../events/order-created.event.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { ProductId } from '../../../../shared/domain/value-objects/product-id.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { TransferOrder } from './transfer-order.entity.js';

describe('TransferOrder', () => {
  it('should create a TransferOrder and apply OrderCreatedEvent', () => {
    const orderId = new OrderId('order-123');
    const orderItems = [new OrderItem(new ProductId('product-1'), new Quantity(2), new Money(10)), new OrderItem(new ProductId('product-2'), new Quantity(1), new Money(20))];
    const orderType = OrderType.TRANSFER;
    const departureWh = new WarehouseId(1);
    const destinationWh = new WarehouseId(2);

    const transferOrder = TransferOrder.create(orderId, orderItems, orderType, departureWh, destinationWh);

    expect(transferOrder).toBeInstanceOf(TransferOrder);
    expect(transferOrder.getDestinationWh()).toEqual(destinationWh);

    const events = transferOrder.getUncommittedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(OrderCreatedEvent);
  });

  it('should mark TransferOrder as reserving and update state', () => {
    const orderId = new OrderId('order-123');
    const orderItems = [new OrderItem(new ProductId('product-1'), new Quantity(2), new Money(10)), new OrderItem(new ProductId('product-2'), new Quantity(1), new Money(20))];
    const orderType = OrderType.TRANSFER;
    const departureWh = new WarehouseId(1);
    const destinationWh = new WarehouseId(2);

    const transferOrder = TransferOrder.create(orderId, orderItems, orderType, departureWh, destinationWh);
    transferOrder.markAsReserving();

    expect(transferOrder.getOrderState()).toEqual(OrderState.RESERVING);
  });

  it('should mark TransferOrder as replenishing and update state', () => {
    const orderId = new OrderId('order-123');
    const orderItems = [new OrderItem(new ProductId('product-1'), new Quantity(2), new Money(10)), new OrderItem(new ProductId('product-2'), new Quantity(1), new Money(20))];
    const orderType = OrderType.TRANSFER;
    const departureWh = new WarehouseId(1);
    const destinationWh = new WarehouseId(2);

    const transferOrder = TransferOrder.create(orderId, orderItems, orderType, departureWh, destinationWh);
    transferOrder.markAsReplenishing();

    expect(transferOrder.getOrderState()).toEqual(OrderState.RESTOCKING);
  });
});