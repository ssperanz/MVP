import { ProductApplicationEvent } from "src/shared/application/events/product-application-event";
import { OrderId } from "src/shared/domain/value-objects/order-id.vo";
import { ProductItem } from "src/shared/domain/value-objects/product-item.vo";

// Application event only for saga
export class ProductsReservedEvent extends ProductApplicationEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly itemsReserved: ProductItem[],
  ) {
    super(orderId);
  }
}