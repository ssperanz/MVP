import { ReservationEvent } from '../../../../shared/domain/events/reservation-event.base.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { ReservationState } from '../../../../shared/domain/enums/reservation-state.enum.js';

export class ReservationUpdatedEvent extends ReservationEvent {
  constructor(
    public readonly reservationId: OrderId,
    public readonly reservationState: ReservationState,
  ) {
    super(reservationId, reservationState);
  }
}