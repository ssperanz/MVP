import { Command } from '@nestjs/cqrs';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';

export class ValidateOrderCommand extends Command<void> {
  constructor(public readonly orderId: OrderId) {
    super();
  }
}
