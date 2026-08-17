import {
  EventBus,
  EventPublisher,
  IEvent,
} from '@nestjs/cqrs';

import { CancelOrderCommand } from '../cancel-order.command.js';
import type { ReservationRepository } from 'src/core/application/reservation/ports/reservation.repository.interface.js';
import { ReservationCancelingRequestedEvent } from 'src/core/domain/reservation/events/reservation-canceling-requested.event.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { CancelOrderCommandHandler } from './cancel-order.handler.js';

describe('CancelOrderCommandHandler', () => {
  let cancelOrderCommandHandler: CancelOrderCommandHandler;
  let reservationRepository: jest.Mocked<ReservationRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    reservationRepository = {
      load: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ReservationRepository>;

    eventBus = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    const publisherMock = {
      mergeObjectContext: jest.fn((reservation) => reservation),
    } as unknown as EventPublisher<IEvent>;

    cancelOrderCommandHandler = new CancelOrderCommandHandler(
      reservationRepository,
      eventBus,
      publisherMock,
    );
  });

  it('should throw an error if the reservation is not found', async () => {
    const command = new CancelOrderCommand('non-existent-order-id');

    reservationRepository.load.mockResolvedValue(null);

    await expect(
      cancelOrderCommandHandler.execute(command),
    ).rejects.toThrow(
      `Reservation with order ID ${command.orderId} not found.`,
    );
  });

  it('should request canceling and publish an event if the reservation is found', async () => {
    const command = new CancelOrderCommand('existing-order-id');

    const reservation = {
      requestCanceling: jest.fn().mockReturnValue([]),
      commit: jest.fn(),
    } as any;

    reservationRepository.load.mockResolvedValue(reservation);

    await cancelOrderCommandHandler.execute(command);

    expect(reservation.requestCanceling).toHaveBeenCalled();

    expect(reservationRepository.save).toHaveBeenCalledWith(
      reservation,
    );

    expect(reservation.commit).toHaveBeenCalled();

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        reservationId: new OrderId(command.orderId),
        toUnreserveItems: [],
      }),
    );
  });
});