import { OrderApplicationEvent } from 'src/shared/application/events/order-application-event.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { ProductItem } from 'src/shared/domain/value-objects/product-item.vo';

export class ReplenishmentDeliveredEvent extends OrderApplicationEvent {
  constructor(
    public readonly replenishmentId: OrderId,
    public readonly orderReference: OrderId,
    public readonly replenishedItems: ProductItem[]) {
    super(replenishmentId);
    this.orderReference = orderReference;
    this.replenishedItems = replenishedItems;
  }
}
