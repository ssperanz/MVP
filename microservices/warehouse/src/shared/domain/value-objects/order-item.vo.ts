import { ProductId } from './product-id.vo.js';
import { Quantity } from './quantity.vo.js';
import { Money } from './money.vo.js';
import { ProductItem } from './product-item.vo.js';

export class OrderItem extends ProductItem {
  private readonly orderItemPrice: Money;
  private readonly orderItemTotalValue: Money;

  constructor(itemId: ProductId, itemQty: Quantity, orderItemPrice: Money) {
    super(itemId, itemQty);
    this.orderItemPrice = orderItemPrice;
    this.orderItemTotalValue = this.calculateTotalItemsValue();
  }

  private calculateTotalItemsValue(): Money {
    return this.orderItemPrice.multiplyBy(this.getQty());
  }

  getItemPrice(): Money {
    return this.orderItemPrice;
  }

  getItemsTotalValue(): Money {
    return this.orderItemTotalValue;
  }
}
