import { OrderEvent } from 'src/shared/domain/events/order-event.base.js';
import { OrderCreatedEvent } from '../../../domain/order/events/order-created.event.js';
import { OrderStateUpdatedEvent } from '../../../domain/order/events/order-state-updated.event.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';
import { OrderType } from 'src/shared/domain/enums/order-type.enum.js';
import { AbstractOrderEventHandler } from './abstract-order-event-handler.js';

class TestOrderEventHandler extends AbstractOrderEventHandler {
  onOrderCreated = jest.fn();
  onOrderStateUpdated = jest.fn();
}

describe('AbstractOrderEventHandler', () => {
  let eventHandler: TestOrderEventHandler;

  beforeEach(() => {
    eventHandler = new TestOrderEventHandler();
  });

  it('should call onOrderCreated when OrderCreatedEvent is handled', async () => {
    const event = new OrderCreatedEvent(
      new OrderId('order-123'), 
      [],
      new WarehouseId(1),
      OrderType.SELL,
      OrderState.CREATED,
      new Money(100),
    );
    await eventHandler.handle(event);
    expect(eventHandler.onOrderCreated).toHaveBeenCalledWith(event);
  });

  it('should call onOrderStateUpdated when OrderStateUpdatedEvent is handled', async () => {
    const event = new OrderStateUpdatedEvent(new OrderId('order-123'), OrderState.RESERVING, OrderType.SELL);
    await eventHandler.handle(event);
    expect(eventHandler.onOrderStateUpdated).toHaveBeenCalledWith(event);
  });
});