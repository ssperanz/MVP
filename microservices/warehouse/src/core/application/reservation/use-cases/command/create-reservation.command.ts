import { Command } from '@nestjs/cqrs';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';
import { ProductItem } from 'src/shared/domain/value-objects/product-item.vo';

export class CreateReservationCommand extends Command<void> {
  constructor(
    public readonly orderId: OrderId,
    public readonly items: ProductItem[],
  ) {
    super();
  }
}
