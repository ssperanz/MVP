import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ValidateOrderCommand } from '../validate-order.command.js';
import { OrderValidationFailedEvent } from '../../../events/order-validation-failed.event.js';
import { OrderValidatedEvent } from '../../../events/order-validated.event.js';
import type { ReservationRepository } from '../../../../../../core/application/reservation/ports/reservation.repository.interface.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { ValidateOrderCommandHandler } from './validate-order.handler.js';
import { Reservation } from 'src/core/domain/reservation/entities/reservation.entity.js';

describe('ValidateOrderCommandHandler', () => {
  let commandHandler: ValidateOrderCommandHandler;
  let reservationRepositoryMock: jest.Mocked<ReservationRepository>;
  let eventBusMock: jest.Mocked<EventBus>;

  beforeEach(() => {
    reservationRepositoryMock = {
      load: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ReservationRepository>;

    eventBusMock = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    commandHandler = new ValidateOrderCommandHandler(reservationRepositoryMock, eventBusMock);
  });

  it('should validate the order and publish OrderValidatedEvent when all items are available', async () => {
    const orderId = new OrderId('order-1');
    const reservationMock = {
      getMissingItems: jest.fn().mockReturnValue([]),
      pause: jest.fn(),
      validate: jest.fn(),
    } as unknown as jest.Mocked<Reservation>;

    reservationRepositoryMock.load.mockResolvedValue(reservationMock);

    const command = new ValidateOrderCommand(orderId);
    await commandHandler.execute(command);

    expect(reservationRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(eventBusMock.publish).toHaveBeenCalledWith(expect.any(OrderValidatedEvent));
    expect(reservationMock.validate).toHaveBeenCalled();
    expect(reservationMock.pause).not.toHaveBeenCalled();
  });

  it('should publish OrderValidationFailedEvent and pause the reservation when there are missing items', async () => {
    const orderId = new OrderId('order-2');
    const missingItems = [{ getId: () => ({ id: 'product-1' }), getQty: () => ({ getValue: () => 5 }) }];
    const reservationMock = {
      getMissingItems: jest.fn().mockReturnValue(missingItems),
      pause: jest.fn(),
      validate: jest.fn(),
    } as unknown as jest.Mocked<Reservation>;

    reservationRepositoryMock.load.mockResolvedValue(reservationMock);

    const command = new ValidateOrderCommand(orderId);
    await commandHandler.execute(command);

    expect(reservationRepositoryMock.load).toHaveBeenCalledWith(orderId);
    expect(eventBusMock.publish).toHaveBeenCalledWith(expect.any(OrderValidationFailedEvent));
    expect(reservationMock.pause).toHaveBeenCalled();
    expect(reservationMock.validate).not.toHaveBeenCalled();
  });

});