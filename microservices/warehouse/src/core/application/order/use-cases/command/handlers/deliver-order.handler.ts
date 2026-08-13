import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import { DeliverOrderCommand } from '../deliver-order.command.js';
import { OrderDeliveredEvent } from '../../../events/order-delivered.event.js';
import { ReplenishmentDeliveredEvent } from '../../../events/replenishment-delivered.event.js';
import { ReplenishmentOrder } from '../../../../../../core/domain/order/entities/replenishment-order.entity.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { Order } from '../../../../../../core/domain/order/entities/order.entity.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { SellOrder } from '../../../../../../core/domain/order/entities/sell-order.entity.js';

@CommandHandler(DeliverOrderCommand)
export class DeliverOrderCommandHandler implements ICommandHandler<DeliverOrderCommand> {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: OrderRepository,
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: DeliverOrderCommand): Promise<void> {
    const order = await this.orderRepository.load(new OrderId(command.orderId));
    if (!order) throw new Error(`Order ${command.orderId} not found`);

    if (order instanceof SellOrder) {
      await this.deliverItems(order);
      this.eventBus.publish(new OrderDeliveredEvent(order.getOrderId()));
      return;
    }

    try {
      await this.deliverItems(order);
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

  private async deliverItems(order: Order): Promise<void> {
    for (const item of order.getOrderItems()) {
      const product = await this.productRepository.loadById(new ProductId(item.getId().id));
      if (!product) throw new Error(`Product ${item.getId().id} not found`);
      product.receive(order.getOrderId(), new Quantity(item.getQty().getValue));
      await this.productRepository.save(product);
    }
  }
}
