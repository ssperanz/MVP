import { Command } from '@nestjs/cqrs';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';

export class NotifyDeliveryCommand extends Command<void> {
  constructor(
    public readonly orderId: string,
  ) {
    super();
  }
}
  