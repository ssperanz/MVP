import { Command } from '@nestjs/cqrs';

export class CreateOrderCommand extends Command<void> {
  constructor(
    public readonly orderType: string,
    public readonly items: Array<{ productId: string; qty: number }>,
    public readonly departure: number | null,
    public readonly destination: { streetName: string; civicNumber: number; city: string; cap: string; country: string } | number,
    public readonly orderReference: string | null,
  ) {
    super();
  }
}