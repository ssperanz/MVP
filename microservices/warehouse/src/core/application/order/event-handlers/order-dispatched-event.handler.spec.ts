import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderDispatchedEvent } from '../events/order-dispatched.event.js';
import type { DispatchNotifierPort } from '../ports/dispatch-notifier.port.js';
import type { OrderRepository } from '../ports/order.repository.interface.js';
import { TransferOrder } from 'src/core/domain/order/entities/transfer-order.entity.js';
import { OrderService } from '../order.service.js';
import { UpdateOrderStateDto } from '../dto/update-order-state.dto.js';
import { SellOrder } from 'src/core/domain/order/entities/sell-order.entity.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { OrderDispatchedEventHandler } from './order-dispatched-event.handler.js';
import { OrderType } from 'src/shared/domain/enums/order-type.enum.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';
import { Order } from 'src/core/domain/order/entities/order.entity.js';
import { Address } from 'src/shared/domain/value-objects/address.vo.js';

describe('OrderDispatchedEventHandler', () => {
  let orderDispatchedEventHandler: OrderDispatchedEventHandler;
  let notifierMock: jest.Mocked<DispatchNotifierPort>;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let orderServiceMock: jest.Mocked<OrderService>;

  beforeEach(() => {
    notifierMock = {
      notify: jest.fn(),
    };

    orderRepositoryMock = {
      load: jest.fn(),
      save: jest.fn(),
      loadAll: jest.fn(),
    };

    orderServiceMock = {
      createOrder: jest.fn(),
      cancelOrder: jest.fn(),
      deliverOrder: jest.fn(),
      updateOrderStatus: jest.fn(),
    } as unknown as jest.Mocked<OrderService>;

    orderDispatchedEventHandler = new OrderDispatchedEventHandler(
      notifierMock,
      orderRepositoryMock,
    );
  });

  it('should handle OrderDispatchedEvent for TransferOrder', async () => {
    const orderId = new OrderId('order-123');
    const event = new OrderDispatchedEvent(
      orderId,
      OrderType.TRANSFER,
      [],
      1,
      2
    );
    const transferOrderMock = new TransferOrder(
      orderId,
      [],
      OrderType.TRANSFER,
      new WarehouseId(1),
      new WarehouseId(2),
      OrderState.DISPATCHED
    );

    orderRepositoryMock.load.mockResolvedValue(transferOrderMock);

    await orderDispatchedEventHandler.handle(event);

    expect(notifierMock.notify).toHaveBeenCalledWith({
      orderId: 'order-123',
      sourceWh: 1,
      destinationWh: 2,
    });
  });

  it('should handle OrderDispatchedEvent for SellOrder', async () => {
    const orderId = new OrderId('order-456');
    const event = new OrderDispatchedEvent(
      orderId, 
      OrderType.SELL,
      [],
      1,
      undefined,
      new Address('Via Roma', 123, 'Roma', '12345', 'Italy')
    );
    const sellOrderMock = new SellOrder(
      orderId,
      [],
      OrderType.SELL,
      new WarehouseId(1),
      new Address('Via Roma', 123, 'Roma', '12345', 'Italy'),
      OrderState.DISPATCHED
    );    

    orderRepositoryMock.load.mockResolvedValue(sellOrderMock);

    await orderDispatchedEventHandler.handle(event);

    expect(orderServiceMock.updateOrderStatus).toHaveBeenCalledWith({
      orderId: 'order-456',
      newState: 'DELIVERED',
      orderType: 'SELL',
    });
  });

  it('should do nothing if order is not found', async () => {
    const orderId = new OrderId('order-789');
    const event = new OrderDispatchedEvent(
      orderId, 
      OrderType.SELL,
      [],
      1,
      undefined,
      new Address('Via Roma', 123, 'Roma', '12345', 'Italy')
    );
    orderRepositoryMock.load.mockResolvedValue(null);

    await orderDispatchedEventHandler.handle(event);

    expect(notifierMock.notify).not.toHaveBeenCalled();
    expect(orderServiceMock.updateOrderStatus).not.toHaveBeenCalled();
  });
});