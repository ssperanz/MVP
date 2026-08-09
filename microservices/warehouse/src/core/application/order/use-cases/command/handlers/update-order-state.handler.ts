import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import { DeliverOrderCommand } from '../deliver-order.command.js';
import { OrderDeliveredEvent } from '../../../events/order-delivered.event.js';
import { ReplenishmentOrder } from 'src/core/domain/order/entities/replenishment-order.entity.js';
import { ReplenishmentDeliveredEvent } from '../../../events/replenishment-delivered.event.js';
import { UpdateOrderStateCommand } from '../update-order-state.command.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';

@CommandHandler(UpdateOrderStateCommand)
export class UpdateOrderStateCommandHandler implements ICommandHandler<UpdateOrderStateCommand> {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: UpdateOrderStateCommand): Promise<void> {
    const order = await this.orderRepository.load(new OrderId(command.orderId));
    if (!order) throw new Error(`Order ${command.orderId} not found`);

    try {
      order.setState(command.newState);
      await this.orderRepository.save(order);
    } catch (error) {
      throw new Error(`Error occurred while updating order state ${command.orderId}: ${error.message}`);
    }
  }
}
