import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import { DeliverOrderCommand } from '../deliver-order.command.js';
import { OrderDeliveredEvent } from '../../../events/order-delivered.event.js';
import { ReplenishmentOrder } from 'src/core/domain/order/entities/replenishment-order.entity.js';
import { ReplenishmentDeliveredEvent } from '../../../events/replenishment-delivered.event.js';

@CommandHandler(DeliverOrderCommand)
export class DeliverOrderCommandHandler implements ICommandHandler<DeliverOrderCommand> {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: OrderRepository,
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: DeliverOrderCommand): Promise<void> {
    const order = await this.orderRepository.load(command.orderId);
    if (!order) throw new Error(`Order ${command.orderId} not found`);

    try {
      for (const item of order.getOrderItems()) {
        const product = await this.productRepository.loadById(item.getId());
        if (!product) throw new Error(`Product ${item.getId().id} not found`);
        product.receive(order.getOrderId(), item.getQty());
        await this.productRepository.save(product);
      }
      if (order instanceof ReplenishmentOrder) {
        this.eventBus.publish(new ReplenishmentDeliveredEvent(order.getOrderId(), order.getOrderReference(), order.getOrderItems()));
      }
      else {
        this.eventBus.publish(new OrderDeliveredEvent(order.getOrderId()));
      }
    } catch (error) {
      throw new Error(`Error occurred while delivering order ${command.orderId}: ${error.message}`);
    }
  }
}
