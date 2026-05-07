import { ReservationState } from 'src/shared/domain/enums/reservation-state.enum';
import { ReservationEvent } from 'src/shared/domain/events/reservation-event.base.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';
import { ReservationItem } from 'src/shared/domain/value-objects/reservation-item.vo';

export class ReservationCreatedEvent extends ReservationEvent {
  constructor(
    public readonly reservationId: OrderId,
    public readonly reservationItems: Array<ReservationItem>,
  ) {
    super(reservationId, ReservationState.CREATED);
  }
}