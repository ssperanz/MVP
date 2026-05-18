import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CancelOrderCommand } from '../cancel-order.command.js';
import type { ReservationRepository } from 'src/core/application/reservation/ports/reservation.repository.interface.js';
import { ReservationCancelingRequestedEvent } from 'src/core/domain/reservation/events/reservation-canceling-requested.event.js';

@CommandHandler(CancelOrderCommand)
export class CancelOrderCommandHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @Inject('IReservationRepository') private readonly reservationRepository: ReservationRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: CancelOrderCommand): Promise<void> {
    const reservation = await this.reservationRepository.load(command.orderId);
    if (!reservation) {
      throw new Error(`Reservation with order ID ${command.orderId.getId} not found.`);
    }
    const toUnreserveItems = reservation.requestCanceling();
    await this.reservationRepository.save(reservation);
    this.eventBus.publish(new ReservationCancelingRequestedEvent(command.orderId, toUnreserveItems));
  }
}
