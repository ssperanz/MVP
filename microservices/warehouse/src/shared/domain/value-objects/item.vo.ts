import { ProductId } from './product-id.vo.js';
import { Quantity } from './quantity.vo.js';

export class Item {
  constructor(
    private readonly itemId: ProductId,
    private readonly itemQty: Quantity,
  ) {}

  getId(): ProductId {
    return this.itemId;
  }

  getQty(): Quantity {
    return this.itemQty;
  }
}
