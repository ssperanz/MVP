import { Command } from '@nestjs/cqrs';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';

export class DeliverOrderCommand extends Command<void> {
  constructor(
    public readonly orderId: string,
    public readonly orderType: string,
    public readonly items: Array<{ productId: string; qty: number }>,
    public readonly sourceWh: number,
    public readonly destinationWh?: number,
    public readonly orderReference?: string
  ) {
    super();
  }
}
  