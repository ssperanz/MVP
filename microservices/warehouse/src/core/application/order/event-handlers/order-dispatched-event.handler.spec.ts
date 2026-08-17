import { OrderDispatchedEventHandler } from './order-dispatched-event.handler.js';
import type { DispatchNotifierPort } from '../ports/dispatch-notifier.port.js';
import type { OrderRepository } from '../ports/order.repository.interface.js';
import { TransferOrder } from 'src/core/domain/order/entities/transfer-order.entity.js';
import { OrderDispatchedEvent } from '../events/order-dispatched.event.js';
import { OrderType } from 'src/shared/domain/enums/order-type.enum.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';

describe('OrderDispatchedEventHandler', () => {
  let handler: OrderDispatchedEventHandler;
  let notifierMock: jest.Mocked<DispatchNotifierPort>;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    notifierMock = {
      notify: jest.fn(),
    };

    orderRepositoryMock = {
      load: jest.fn(),
      save: jest.fn(),
      loadAll: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    handler = new OrderDispatchedEventHandler(
      notifierMock,
      orderRepositoryMock,
    );
  });

  it('should notify when the dispatched order is a TransferOrder', async () => {
    const orderId = new OrderId('order-123');

    const event = new OrderDispatchedEvent(
      orderId,
      OrderType.TRANSFER,
      [],
      1,
      2,
    );

    const transferOrder = new TransferOrder(
      orderId,
      [],
      OrderType.TRANSFER,
      new WarehouseId(1),
      new WarehouseId(2),
      OrderState.DISPATCHED,
    );

    orderRepositoryMock.load.mockResolvedValue(transferOrder);

    await handler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(notifierMock.notify).toHaveBeenCalledWith(event);
  });

  it('should do nothing when the order is not found', async () => {
    const orderId = new OrderId('order-789');

    const event = new OrderDispatchedEvent(
      orderId,
      OrderType.TRANSFER,
      [],
      1,
      2,
    );

    orderRepositoryMock.load.mockResolvedValue(null);

    await handler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(notifierMock.notify).not.toHaveBeenCalled();
  });

  it('should not notify when the order is not a TransferOrder', async () => {
    const orderId = new OrderId('order-456');

    const event = new OrderDispatchedEvent(
      orderId,
      OrderType.SELL,
      [],
      1,
    );

    // Basta un mock di Order che NON sia instanceof TransferOrder.
    const sellOrder = {} as any;

    orderRepositoryMock.load.mockResolvedValue(sellOrder);

    await handler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(notifierMock.notify).not.toHaveBeenCalled();
  });
});