import { AggregateRoot } from '@nestjs/cqrs';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { Item } from '../../../../shared/domain/value-objects/item.vo.js';
import { ReservationItem } from '../../../../shared/domain/value-objects/reservation-item.vo.js';
import { ReservationState } from '../../../../shared/domain/enums/reservation-state.enum.js';
import { ReservationItemState } from '../../../../shared/domain/enums/reservation-item-state.enum.js';
import { ReservationCreatedEvent } from '../events/reservation-created.event.js';
import { ReservationUpdatedEvent } from '../events/reservation-updated.event.js';
import { ReservationCompletedEvent } from '../events/reservation-completed.event.js';
import { ReservationCanceledEvent } from '../events/reservation-canceled.event.js';

export class Reservation extends AggregateRoot {
  private orderId: OrderId;
  private reservedItems: ReservationItem[];
  private state: ReservationState;

  constructor(
    orderId: OrderId,
    reservedItems: ReservationItem[],
    state: ReservationState = ReservationState.CREATED,
  ) {
    super();
    this.orderId = orderId;
    this.reservedItems = reservedItems;
    this.state = state;
  }

  getOrderId(): OrderId { return this.orderId; }
  getReservedItems(): ReservationItem[] { return this.reservedItems; }
  getState(): ReservationState { return this.state; }

  private updateState(newState: ReservationState): void {
    this.state = newState;
  }

  static create(items: Item[]): Reservation {
    const reservationItems = items.map(
      (item) => new ReservationItem(item.getId(), item.getQty(), ReservationItemState.INITIALIZED),
    );
    const orderId = new OrderId(crypto.randomUUID());
    const reservation = new Reservation(orderId, reservationItems);
    this.apply(new ReservationCreatedEvent(orderId, reservationItems));
    return reservation;
  }

  reserve(items: Item[]): ReservationItem[] {
    this.updateState(ReservationState.PROCESSING);
    for (const item of items) {
      const reservationItem = this.reservedItems.find(
        (ri) => ri.getId().id === item.getId().id,
      );
      if (reservationItem) {
        reservationItem.updateItemState(ReservationItemState.RESERVED);
      }
    }
    this.apply(new ReservationUpdatedEvent(this.orderId, this.state, this.reservedItems));
    return this.reservedItems;
  }

  release(productIds: string[]): void {
    this.updateState(ReservationState.RELEASING);
    for (const pid of productIds) {
      const reservationItem = this.reservedItems.find(
        (ri) => ri.getId().id === pid,
      );
      if (reservationItem) {
        reservationItem.updateItemState(ReservationItemState.RELEASED);
      }
    }
    this.apply(new ReservationUpdatedEvent(this.orderId, this.state, this.reservedItems));
  }

  releaseAll(): void {
    this.updateState(ReservationState.RELEASING);
    for (const reservationItem of this.reservedItems) {
      reservationItem.updateItemState(ReservationItemState.RELEASED);
    }
    this.apply(new ReservationUpdatedEvent(this.orderId, this.state, this.reservedItems));
  }

  complete(): void {
    this.updateState(ReservationState.COMPLETED);
    this.apply(new ReservationCompletedEvent(this.orderId, this.state));
  }

  cancel(): void {
    this.releaseAll();
    this.updateState(ReservationState.CANCELED);
    this.apply(new ReservationCanceledEvent(this.orderId));
  }
}
