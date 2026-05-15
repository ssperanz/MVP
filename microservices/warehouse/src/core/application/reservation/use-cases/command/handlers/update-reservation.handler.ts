import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { ReservationRepository } from '../../../ports/reservation.repository.interface.js';
import { UpdateReservationCommand } from '../update-reservation.command.js';

@CommandHandler(UpdateReservationCommand)
export class UpdateReservationCommandHandler implements ICommandHandler<UpdateReservationCommand> {
  constructor(
    @Inject('IReservationRepository') private readonly reservationRepository: ReservationRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: UpdateReservationCommand): Promise<void> {
    const reservation = await this.reservationRepository.load(command.orderId);
    if (!reservation) {
      throw new Error(`Reservation with order ID ${command.orderId.getId} not found.`);
    }
    const tracked = this.publisher.mergeObjectContext(reservation);
    tracked.reserve(command.items);
    await this.reservationRepository.save(tracked);
    tracked.commit();
  }
}
