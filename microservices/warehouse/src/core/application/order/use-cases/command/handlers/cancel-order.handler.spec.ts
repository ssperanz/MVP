import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CancelOrderCommand } from '../cancel-order.command.js';
import type { ReservationRepository } from 'src/core/application/reservation/ports/reservation.repository.interface.js';
import { ReservationCancelingRequestedEvent } from 'src/core/domain/reservation/events/reservation-canceling-requested.event.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { CancelOrderCommandHandler } from './cancel-order.handler.js';

describe('CancelOrderCommandHandler', () => {
  let cancelOrderCommandHandler: CancelOrderCommandHandler;
  let reservationRepository: ReservationRepository;
  let eventBus: EventBus;

  beforeEach(() => {
    reservationRepository = {
      load: jest.fn(),
      save: jest.fn(),
    } as unknown as ReservationRepository;

    eventBus = {
      publish: jest.fn(),
    } as unknown as EventBus;

    cancelOrderCommandHandler = new CancelOrderCommandHandler(reservationRepository, eventBus);
  });

  it('should throw an error if the reservation is not found', async () => {
    const command = new CancelOrderCommand('non-existent-order-id');
    (reservationRepository.load as jest.Mock).mockResolvedValue(null);

    await expect(cancelOrderCommandHandler.execute(command)).rejects.toThrow(
      `Reservation with order ID ${command.orderId} not found.`,
    );
  });

  it('should request canceling and publish an event if the reservation is found', async () => {
    const command = new CancelOrderCommand('existing-order-id');
    const reservation = {
      requestCanceling: jest.fn(),
    };
    (reservationRepository.load as jest.Mock).mockResolvedValue(reservation);
    (reservation.requestCanceling as jest.Mock).mockReturnValue([]);

    await cancelOrderCommandHandler.execute(command);

    expect(reservation.requestCanceling).toHaveBeenCalled();
    expect(reservationRepository.save).toHaveBeenCalledWith(reservation);
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        reservationId: new OrderId(command.orderId),
        toUnreserveItems: [],
      }),
    );
  });
});
