import { Command } from '@nestjs/cqrs';
import { OrderState } from 'src/shared/domain/enums/order-state.enum';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo';

export class UpdateOrderStateCommand extends Command<void> {
  constructor(public readonly orderId: OrderId, public readonly newState: OrderState) {
    super();
  }
}
