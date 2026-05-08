import { ProductId } from './product-id.vo.js';
import { Quantity } from './quantity.vo.js';
import { ProductItem } from './product-item.vo.js';
import { ReservationItemState } from '../enums/reservation-item-state.enum.js';

export class ReservationItem extends ProductItem {
  private itemState: ReservationItemState;

  constructor(
    itemId: ProductId,
    itemQty: Quantity,
    itemState: ReservationItemState = ReservationItemState.INITIALIZED,
  ) {
    super(itemId, itemQty);
    this.itemState = itemState;
  }

  getState(): ReservationItemState {
    return this.itemState;
  }

  updateItemState(newState: ReservationItemState): void {
    this.itemState = newState;
  }
}
