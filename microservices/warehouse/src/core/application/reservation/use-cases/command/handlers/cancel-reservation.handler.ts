import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { ReservationRepository } from '../../../ports/reservation.repository.interface.js';
import { CancelReservationCommand } from '../cancel-reservation.command.js';

@CommandHandler(CancelReservationCommand)
export class CancelReservationCommandHandler implements ICommandHandler<CancelReservationCommand> {
  constructor(
    @Inject('IReservationRepository') private readonly reservationRepository: ReservationRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CancelReservationCommand): Promise<void> {
    const reservation = await this.reservationRepository.load(command.orderId);
    if (!reservation) {
      throw new Error(`Reservation with order ID ${command.orderId.getId} not found.`);
    }
    const tracked = this.publisher.mergeObjectContext(reservation);
    tracked.cancel();
    await this.reservationRepository.save(tracked);
    tracked.commit();
  }
}
