import { Command } from '@nestjs/cqrs';

export class ValidateOrderCommand extends Command<void> {
  constructor(public readonly orderId: string) {
    super();
  }
}
