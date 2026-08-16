import { CommandHandler, ICommandHandler, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import { DeliverOrderCommand } from '../deliver-order.command.js';
import { OrderDeliveredEvent } from '../../../events/order-delivered.event.js';
import { ReplenishmentDeliveredEvent } from '../../../events/replenishment-delivered.event.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { ProductItem } from '../../../../../../shared/domain/value-objects/product-item.vo.js';
import { OrderReceivedEvent } from '../../../events/order-received.event.js';

@CommandHandler(DeliverOrderCommand)
export class DeliverOrderCommandHandler implements ICommandHandler<DeliverOrderCommand> {
  constructor(
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private eventBus: EventBus,
    private publisher: EventPublisher,
  ) {}

  async execute(command: DeliverOrderCommand): Promise<void> {
    if (command.orderType === 'SELL') {
      this.eventBus.publish(new OrderDeliveredEvent(new OrderId(command.orderId)));
      return;
    }

    try {
      await this.deliverItems(command.orderId, command.items);
      this.eventBus.publish(
        new OrderReceivedEvent(
          new OrderId(command.orderId),
          command.sourceWh,
          command.destinationWh!
        ));

      if (command.orderType === 'REPLENISHMENT') {
        this.eventBus.publish(
          new ReplenishmentDeliveredEvent(
            new OrderId(command.orderId),
            new OrderId(command.orderReference ?? 'undefined'),
            command.items.map((item) => new ProductItem(new ProductId(item.productId), new Quantity(item.qty)))   
          )
        );
      }
      
    } catch (error) {
      throw new Error(`Error occurred while delivering order ${command.orderId}: ${error.message}`);
    }
  }

  private async deliverItems(orderId: string, items: Array<{ productId: string; qty: number }>): Promise<void> {
    for (const item of items) {
      const product = await this.productRepository.loadById(
        new ProductId(item.productId),
      );

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const trackedProduct = this.publisher.mergeObjectContext(product);

      trackedProduct.receive(
        new OrderId(orderId),
        new Quantity(item.qty),
      );

      await this.productRepository.save(trackedProduct);

      trackedProduct.commit();
    }
  }
}
