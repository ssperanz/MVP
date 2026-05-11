import { Command } from '@nestjs/cqrs';

export class CreateReservationCommand extends Command<void> {
  constructor(
    public readonly orderId: string,
    public readonly items: Array<{ productId: string; qty: number }>,
  ) {
    super();
  }
}
