import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { ReservationRepository } from '../../../ports/reservation.repository.interface.js';
import { CancelReservationCommand } from '../cancel-reservation.command.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { Reservation } from 'src/core/domain/reservation/entities/reservation.entity.js';
import { CancelReservationCommandHandler } from './cancel-reservation.handler.js';

describe('CancelReservationCommandHandler', () => {
  let commandHandler: CancelReservationCommandHandler;
  let reservationRepository: ReservationRepository;
  let eventPublisher: EventPublisher;

  beforeEach(() => {
    reservationRepository = {
      load: jest.fn(),
      save: jest.fn(),
    } as unknown as ReservationRepository;

    eventPublisher = {
      mergeObjectContext: jest.fn().mockImplementation((reservation) => reservation),
    } as unknown as EventPublisher;

    commandHandler = new CancelReservationCommandHandler(reservationRepository, eventPublisher);
  });

  it('should cancel an existing reservation and commit the event', async () => {
    const command = new CancelReservationCommand(new OrderId('order-1'));

    const mockReservation = {
      cancel: jest.fn(),
      commit: jest.fn(),
    } as unknown as Reservation;

    (reservationRepository.load as jest.Mock).mockResolvedValue(mockReservation);

    await commandHandler.execute(command);

    expect(reservationRepository.load).toHaveBeenCalledWith(command.orderId);
    expect(mockReservation.cancel).toHaveBeenCalled();
    expect(reservationRepository.save).toHaveBeenCalledWith(mockReservation);
    expect(mockReservation.commit).toHaveBeenCalled();
    expect(eventPublisher.mergeObjectContext).toHaveBeenCalledWith(mockReservation);
  });

  it('should throw an error if the reservation does not exist', async () => {
    const command = new CancelReservationCommand(new OrderId('order-1'));

    (reservationRepository.load as jest.Mock).mockResolvedValue(null);

    await expect(commandHandler.execute(command)).rejects.toThrow(
      `Reservation with order ID ${command.orderId.getId} not found.`,
    );

    expect(reservationRepository.load).toHaveBeenCalledWith(command.orderId);
    expect(reservationRepository.save).not.toHaveBeenCalled();
  });
});