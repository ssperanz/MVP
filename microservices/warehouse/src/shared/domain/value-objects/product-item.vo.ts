import { ProductId } from './product-id.vo.js';
import { Quantity } from './quantity.vo.js';

export class ProductItem {
  constructor(
    protected readonly itemId: ProductId,
    protected readonly itemQty: Quantity,
  ) {}

  getId(): ProductId {
    return this.itemId;
  }

  getQty(): Quantity {
    return this.itemQty;
  }

  increaseBy(qty: Quantity): void {
    this.itemQty.increaseBy(qty);
  }

  decreaseBy(qty: Quantity): void {
    this.itemQty.decreaseBy(qty);
  }
}
