import { ReservationEvent } from 'src/shared/domain/events/reservation-event.base.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { ReservationState } from 'src/shared/domain/enums/reservation-state.enum.js';

export class ReservationCompletedEvent extends ReservationEvent {
  constructor(
    public readonly reservationId: OrderId,
  ) {
    super(reservationId, ReservationState.VALIDATED);
  }
}