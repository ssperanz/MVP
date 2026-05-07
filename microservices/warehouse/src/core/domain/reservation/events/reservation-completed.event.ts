import { ReservationEvent } from 'src/shared/domain/events/reservation-event.base.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { ReservationState } from 'src/shared/domain/enums/reservation-state.enum.js';
import { ReservationItem } from 'src/shared/domain/value-objects/reservation-item.vo.js';

export class ReservationCompletedEvent extends ReservationEvent {
  constructor(
    public readonly reservationId: OrderId,
    public readonly reservationState: ReservationState,
  ) {
    super(reservationId, reservationState);
  }
}