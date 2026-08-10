import { AggregateRoot } from '@nestjs/cqrs';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { ProductItem } from '../../../../shared/domain/value-objects/product-item.vo.js';
import { ReservationItem } from '../../../../shared/domain/value-objects/reservation-item.vo.js';
import { ReservationItemState } from '../../../../shared/domain/enums/reservation-item-state.enum.js';
import { ReservationCreatedEvent } from '../events/reservation-created.event.js';
import { ReservationCompletedEvent } from '../events/reservation-completed.event.js';
import { ReservationCanceledEvent } from '../events/reservation-canceled.event.js';
import { ReservationUpdatedEvent } from '../events/reservation-updated.event.js';
import { ReservationCancelingRequestedEvent } from '../events/reservation-canceling-requested.event.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { ReservationState } from 'src/shared/domain/enums/reservation-state.enum.js';

export class Reservation extends AggregateRoot {
  private orderId: OrderId;
  private reservationItems: ReservationItem[];
  private state: ReservationState;

  constructor(
    orderId: OrderId,
    reservationItems: ReservationItem[],
  ) {
    super();
    this.orderId = orderId;
    this.reservationItems = reservationItems;
  }

  getOrderId(): OrderId { return this.orderId; }
  getReservationItems(): ReservationItem[] { return this.reservationItems; }
  getState(): ReservationState { return this.state; }

  private updateState(newState: ReservationState): void {
    this.state = newState;
  }

    private releaseAll(): void {
    for (const reservationItem of this.reservationItems) {
      if (reservationItem.getState() !== ReservationItemState.RELEASED) {
        reservationItem.release();
      }
    }
  }

  getMissingItems(): ProductItem[] {
    const missingItems: ProductItem[] = [];
    for (const reservationItem of this.reservationItems) {
      const missingQty = reservationItem.validateItem();
      if (missingQty > 0) {
        missingItems.push(new ProductItem(reservationItem.getId(), new Quantity(missingQty)));
      }
    }
    return missingItems;
  }

  getProductsWithReservedQty(): ProductItem[] {
    return this.reservationItems.map(ri => ri.getProductWithReservedQty());
  }

  static create(orderId: OrderId, items: ProductItem[]): Reservation {
    const reservationItems = items.map(
      (item) => ReservationItem.create(item.getId(), item.getQty())
    );
    const reservation = new Reservation(orderId, reservationItems);
    reservation.updateState(ReservationState.CREATED);
    reservation.apply(new ReservationCreatedEvent(orderId, reservationItems));
    return reservation;
  }

  reserve(items: ProductItem[]): ReservationItem[] {
    for (const item of items) {
      const reservationItem = this.reservationItems.find(
        (ri) => ri.getId().id === item.getId().id,
      );
      if (reservationItem) {
        reservationItem.reserve(item.getQty());
      }
    }
    this.updateState(ReservationState.RESERVED);
    this.apply(new ReservationUpdatedEvent(this.orderId));
    return this.reservationItems;
  }

  validate(): void {
    this.updateState(ReservationState.VALIDATED);
    this.apply(new ReservationCompletedEvent(this.orderId));
  }

  pause(): void {
    this.updateState(ReservationState.PENDING);
    this.apply(new ReservationUpdatedEvent(this.orderId));
  }

  requestCanceling(): ProductItem[] {
    this.updateState(ReservationState.CANCELING);
    this.apply(new ReservationCancelingRequestedEvent(this.orderId, this.reservationItems));
    return this.getProductsWithReservedQty();
  }

  cancel(): void {
    this.releaseAll();
    this.updateState(ReservationState.CANCELED);
    this.apply(new ReservationCanceledEvent(this.orderId));
  }
}
