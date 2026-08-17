import { EventPublisher } from '@nestjs/cqrs';

import type { OrderRepository } from '../ports/order.repository.interface.js';

import { ReservationCreatedEvent } from '../../../domain/reservation/events/reservation-created.event.js';
import { ReservationUpdatedEvent } from '../../../domain/reservation/events/reservation-updated.event.js';
import { ReservationCancelingRequestedEvent } from '../../../domain/reservation/events/reservation-canceling-requested.event.js';

import { OrderValidatedEvent } from '../events/order-validated.event.js';
import { OrderValidationFailedEvent } from '../events/order-validation-failed.event.js';
import { OrderDispatchedEvent } from '../events/order-dispatched.event.js';
import { OrderDispatchFailedEvent } from '../events/order-dispatch-failed.event.js';
import { OrderDeliveredEvent } from '../events/order-delivered.event.js';
import { OrderCanceledEvent } from '../events/order-canceled.event.js';

import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../shared/domain/enums/order-state.enum.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo.js';

import { ProductsReservedEvent } from '../../product/events/products-reserved.event.js';

import { OrderStateUpdatedEvent } from '../../../domain/order/events/order-state-updated.event.js';
import { OrderReadModelUpdater } from './order-read-model-updater.js';
import { UpdateOrderStateHandler } from './update-order-state.handler.js';

describe('UpdateOrderStateHandler', () => {
  let updateOrderStateHandler: UpdateOrderStateHandler;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let publisherMock: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    orderRepositoryMock = {
      load: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    publisherMock = {
      mergeObjectContext: jest.fn((order) => order as any),
    } as unknown as jest.Mocked<EventPublisher>;

    updateOrderStateHandler = new UpdateOrderStateHandler(
      orderRepositoryMock,
      publisherMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle OrderValidatedEvent and update order state to dispatching', async () => {
    const orderId = { getId: () => 'order-123' } as any;

    const orderMock = {
      markAsDispatching: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new OrderValidatedEvent(orderId);

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(orderMock.markAsDispatching).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should handle OrderValidationFailedEvent and update order state to restocking', async () => {
    const orderId = { getId: () => 'order-123' } as any;

    const orderMock = {
      markAsRestocking: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new OrderValidationFailedEvent(
      new WarehouseId(1),
      orderId,
      [
        {
          productId: 'product-1',
          qty: 10,
        },
      ],
    );

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(orderMock.markAsRestocking).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should handle OrderDispatchedEvent and update order state to dispatched', async () => {
    const orderId = { getId: () => 'order-123' } as any;

    const orderMock = {
      markAsDispatched: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new OrderDispatchedEvent(
      orderId,
      OrderType.TRANSFER,
      [],
      1,
      2,
    );

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(orderMock.markAsDispatched).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should handle OrderCanceledEvent and update order state to canceled', async () => {
    const orderId = { getId: () => 'order-123' } as any;

    const orderMock = {
      markAsCanceled: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new OrderCanceledEvent(orderId);

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(orderMock.markAsCanceled).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should do nothing if order is not found', async () => {
    const orderId = { getId: () => 'order-123' } as any;

    orderRepositoryMock.load.mockResolvedValue(null);

    const event = new OrderValidatedEvent(orderId);

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should handle ReservationCreatedEvent and update order state to reserving', async () => {
    const reservationId = {
      getId: () => 'reservation-123',
    } as any;

    const orderMock = {
      markAsReserving: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new ReservationCreatedEvent(
      reservationId,
      [],
    );

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(reservationId);
    expect(orderMock.markAsReserving).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should handle ProductsReservedEvent and update order state to reserved', async () => {
    const orderId = {
      getId: () => 'order-123',
    } as any;

    const orderMock = {
      markAsReserved: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new ProductsReservedEvent(
      orderId,
      [],
    );

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(orderMock.markAsReserved).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should handle ReservationUpdatedEvent and update order state to validating', async () => {
    const reservationId = {
      getId: () => 'reservation-123',
    } as any;

    const orderMock = {
      markAsValidating: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new ReservationUpdatedEvent(
      reservationId,
    );

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(reservationId);
    expect(orderMock.markAsValidating).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should handle ReservationCancelingRequestedEvent and update order state to canceling', async () => {
    const reservationId = {
      getId: () => 'reservation-123',
    } as any;

    const orderMock = {
      markAsCanceling: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new ReservationCancelingRequestedEvent(
      reservationId,
      [],
    );

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(reservationId);
    expect(orderMock.markAsCanceling).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should handle OrderDispatchFailedEvent and update order state to canceling', async () => {
    const orderId = {
      getId: () => 'order-123',
    } as any;

    const orderMock = {
      markAsCanceling: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new OrderDispatchFailedEvent(
      orderId,
      'Some reason',
    );

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(orderMock.markAsCanceling).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should handle OrderDeliveredEvent and update order state to delivered', async () => {
    const orderId = {
      getId: () => 'order-123',
    } as any;

    const orderMock = {
      markAsDelivered: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new OrderDeliveredEvent(orderId);

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(orderMock.markAsDelivered).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should handle OrderCanceledEvent and update order state to canceled', async () => {
    const orderId = {
      getId: () => 'order-123',
    } as any;

    const orderMock = {
      markAsCanceled: jest.fn(),
      commit: jest.fn(),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const event = new OrderCanceledEvent(orderId);

    await updateOrderStateHandler.handle(event);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(orderMock.markAsCanceled).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
    expect(orderMock.commit).toHaveBeenCalled();
  });

  it('should not update the order read model when the order does not exist', async () => {
    const orderReadModelMock = {
      upsert: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const orderReadModelUpdater = new OrderReadModelUpdater(
      orderReadModelMock,
    );

    (
      orderReadModelMock.findById as jest.Mock
    ).mockResolvedValue(null);

    const event = new OrderStateUpdatedEvent(
      new OrderId('order-123'),
      OrderState.RESERVING,
      OrderType.SELL,
    );

    await orderReadModelUpdater.onOrderStateUpdated(event);

    expect(orderReadModelMock.findById).toHaveBeenCalledWith(
      'order-123',
    );

    expect(orderReadModelMock.upsert).not.toHaveBeenCalled();
  });
});