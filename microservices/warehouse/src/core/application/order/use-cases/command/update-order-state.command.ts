import { Command } from '@nestjs/cqrs';

export class UpdateOrderStateCommand extends Command<void> {
  constructor(
    public readonly orderId: string,
    public readonly newState: string,
  ) {
    super();
  }
}