import { Command } from '@nestjs/cqrs';
import { OrderId } from '../../../../../shared/domain/value-objects/order-id.vo';
import { ProductItem } from '../../../../../shared/domain/value-objects/product-item.vo';

export class ReserveProductsCommand extends Command<void> {
  constructor(
    public readonly orderId: OrderId,
    public readonly items: ProductItem[],
  ) {
    super();
  }
}
