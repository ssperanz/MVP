import { Order } from './order.entity.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../shared/domain/value-objects/order-item.vo.js';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum.js';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { Address } from '../../../../shared/domain/value-objects/address.vo.js';
import { OrderCreatedEvent } from '../events/order-created.event.js';
import { SellOrder } from './sell-order.entity.js';
import { ProductId } from '../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';

describe('SellOrder', () => {
  it('should create a SellOrder and apply OrderCreatedEvent', () => {
    const orderId = new OrderId('order-123');
  const orderItems = [new OrderItem(new ProductId('product-1'), new Quantity(2), new Money(10)), new OrderItem(new ProductId('product-2'), new Quantity(1), new Money(20) )];
    const orderType = OrderType.SELL;
    const departureWh = new WarehouseId(1);
    const destination = new Address('Main St', 123, 'City', '12345', 'Country');

    const sellOrder = SellOrder.create(orderId, orderItems, orderType, departureWh, destination);

    expect(sellOrder).toBeInstanceOf(SellOrder);
    expect(sellOrder.getDestination()).toEqual(destination);

    const events = sellOrder.getUncommittedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(OrderCreatedEvent);
  });
});

