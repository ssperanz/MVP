import { EventType } from 'src/shared/domain/enums/event-type.js';
import { DomainEvent } from './domain-event.base.js';
import { OrderId } from '../value-objects/order-id.vo.js';
import { ReservationState } from '../enums/reservation-state.enum.js';

export abstract class ReservationEvent extends DomainEvent {
  constructor(public readonly reservationId: OrderId, public reservationState: ReservationState) {
    super();
    this.eventType = EventType.Reservation;
  }
}