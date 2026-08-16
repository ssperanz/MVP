import { CommandHandler, ICommandHandler, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderDeliveredEvent } from '../../../events/order-delivered.event.js';
import { ReplenishmentDeliveredEvent } from '../../../events/replenishment-delivered.event.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { NotifyDeliveryCommand } from '../notify-delivery.command.js';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import { TransferOrder } from '../../../../../../core/domain/order/entities/transfer-order.entity.js';

@CommandHandler(NotifyDeliveryCommand)
export class NotifyDeliveryCommandHandler implements ICommandHandler<NotifyDeliveryCommand> {
  constructor(
    @Inject('IOrderRepository') private readonly OrderRepository: OrderRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: NotifyDeliveryCommand): Promise<void> {
    const order = await this.OrderRepository.load(new OrderId(command.orderId));
    if (!order) {
      throw new Error(`Order ${command.orderId} not found`);
    }
    if (order instanceof TransferOrder) {
      this.eventBus.publish(
        new OrderDeliveredEvent(
          order.getOrderId(),
        ));
    }
  }

}
