import { CommandHandler, ICommandHandler, EventPublisher, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ReserveProductsCommand } from '../reserve-products.command.js';
import type { ProductRepository } from '../../../ports/product.repository.interface.js';
import { ProductsReservedEvent } from '../../../events/products-reserved.event.js';
import { ProductItem } from 'src/shared/domain/value-objects/product-item.vo.js';

@CommandHandler(ReserveProductsCommand)
export class ReserveProductsCommandHandler implements ICommandHandler<ReserveProductsCommand> {
  constructor(
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private publisher: EventPublisher,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ReserveProductsCommand): Promise<void> {
    const reservedItems: ProductItem[] = [];
    for (const item of command.items) {
      const product = await this.productRepository.loadById(item.getId());
      if (product) {
        const trackedProduct = this.publisher.mergeObjectContext(product);
        trackedProduct.reserve(command.orderId,item.getQty());
        await this.productRepository.save(trackedProduct);
        trackedProduct.commit();
        reservedItems.push(item);
      }
    }
    this.eventBus.publish(new ProductsReservedEvent(command.orderId, reservedItems));
  }
}