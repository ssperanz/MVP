import { ReservationEvent } from '../../../../shared/domain/events/reservation-event.base.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { ReservationState } from '../../../../shared/domain/enums/reservation-state.enum.js';
import { ProductItem } from '../../../../shared/domain/value-objects/product-item.vo';

export class ReservationCancelingRequestedEvent extends ReservationEvent {
  constructor(
    public readonly reservationId: OrderId,
    public readonly toUnreserveItems: ProductItem[],
  ) {
    super(reservationId, ReservationState.CANCELING);
  }
}