import { Command } from '@nestjs/cqrs';

export class UpdateProductCommand extends Command<void> {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly price?: number,
    public readonly quantity?: number,
    public readonly minThres?: number,
    public readonly maxThres?: number,
  ) {
    super();
  }
}