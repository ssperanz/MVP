import { CommandHandler, ICommandHandler, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CancelOrderCommand } from '../cancel-order.command.js';
import type { ReservationRepository } from '../../../../../../core/application/reservation/ports/reservation.repository.interface.js';
import { ReservationCancelingRequestedEvent } from '../../../../../../core/domain/reservation/events/reservation-canceling-requested.event.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';

@CommandHandler(CancelOrderCommand)
export class CancelOrderCommandHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @Inject('IReservationRepository') private readonly reservationRepository: ReservationRepository,
    private eventBus: EventBus,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CancelOrderCommand): Promise<void> {
    const reservation = await this.reservationRepository.load(new OrderId(command.orderId));
    if (!reservation) {
      throw new Error(`Reservation with order ID ${command.orderId} not found.`);
    }
    const trackedReservation = this.publisher.mergeObjectContext(reservation);
    const toUnreserveItems = trackedReservation.requestCanceling();
    await this.reservationRepository.save(trackedReservation);
    trackedReservation.commit();
    this.eventBus.publish(new ReservationCancelingRequestedEvent(new OrderId(command.orderId), toUnreserveItems));
  }
}
