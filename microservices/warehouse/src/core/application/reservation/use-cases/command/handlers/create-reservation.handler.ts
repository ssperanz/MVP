import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateReservationCommand } from '../create-reservation.command.js';
import type { ReservationRepository } from '../../../ports/reservation.repository.interface.js';
import { Reservation } from '../../../../../domain/reservation/entities/reservation.entity.js';

@CommandHandler(CreateReservationCommand)
export class CreateReservationCommandHandler implements ICommandHandler<CreateReservationCommand> {
  constructor(
    @Inject('IReservationRepository') private readonly reservationRepository: ReservationRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateReservationCommand): Promise<void> {
    const reservation = Reservation.create(command.orderId, command.items);
    const tracked = this.publisher.mergeObjectContext(reservation);
    await this.reservationRepository.save(tracked);
    tracked.commit();
  }
}
