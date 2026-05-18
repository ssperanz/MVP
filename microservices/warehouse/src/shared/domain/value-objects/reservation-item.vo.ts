import { ProductId } from './product-id.vo.js';
import { Quantity } from './quantity.vo.js';
import { ProductItem } from './product-item.vo.js';
import { ReservationItemState } from '../enums/reservation-item-state.enum.js';

export class ReservationItem extends ProductItem {
  private itemState: ReservationItemState;
  private itemReservedQty: Quantity;

  constructor(
    itemId: ProductId,
    itemRequestedQty: Quantity,
  ) {
    super(itemId, itemRequestedQty);
    this.itemReservedQty = new Quantity(0);
  }

  getState(): ReservationItemState {
    return this.itemState;
  }

  getReservedQty(): Quantity {
    return this.itemReservedQty;
  }

  getRequestedQty(): Quantity {
    return this.getQty();
  }

  getProductWithReservedQty(): ProductItem {
    return new ProductItem(this.getId(), this.getReservedQty());
  }

  static create(itemId: ProductId, itemRequestedQty: Quantity): ReservationItem {
    const reservationItem = new ReservationItem(itemId, itemRequestedQty);
    reservationItem.updateItemState(ReservationItemState.INITIALIZED);
    return reservationItem;
  }

  private updateItemState(newState: ReservationItemState): void {
    this.itemState = newState;
  }

  reserve(reservedQty: Quantity): void {
    this.itemReservedQty.increaseBy(reservedQty);
    this.updateItemState(ReservationItemState.RESERVED);
  }

  release(): void {
    this.itemReservedQty.decreaseBy(this.itemReservedQty);
    this.updateItemState(ReservationItemState.RELEASED);
  }

  validateItem(): number {
    return this.getRequestedQty().getValue - this.getReservedQty().getValue;
  }
}