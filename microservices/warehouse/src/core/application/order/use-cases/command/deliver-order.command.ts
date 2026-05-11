import { Command } from '@nestjs/cqrs';

export class DeliverOrderCommand extends Command<void> {
  constructor(public readonly orderId: string) {
    super();
  }
}
