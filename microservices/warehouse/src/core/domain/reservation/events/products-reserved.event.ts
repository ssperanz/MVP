import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { ReservationEvent } from 'src/shared/domain/events/reservation-event.base.js';
import { ReservationState } from 'src/shared/domain/enums/reservation-state.enum';
import { ReservationItem } from 'src/shared/domain/value-objects/reservation-item.vo';

export class ProductsReservedEvent extends ReservationEvent {
  constructor(
    public readonly reservationId: OrderId,
    public readonly itemsReserved: Array<ReservationItem>,
  ) {
    super(reservationId, ReservationState.PROCESSING);
  }
}
