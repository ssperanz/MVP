import { ProductApplicationEvent } from "../../../../shared/application/events/product-application-event";
import { OrderId } from "../../../../shared/domain/value-objects/order-id.vo";
import { ProductItem } from "../../../../shared/domain/value-objects/product-item.vo";

// Application event only for saga
export class ProductsReleasedEvent extends ProductApplicationEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly itemsReleased: ProductItem[],
  ) {
    super(orderId);
  }
}