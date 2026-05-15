import { CommandHandler, ICommandHandler, EventPublisher, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { ProductRepository } from '../../../ports/product.repository.interface.js';
import { ProductsReleasedEvent } from '../../../events/products-released.event.js';
import { ProductItem } from 'src/shared/domain/value-objects/product-item.vo.js';
import { ReleaseProductsCommand } from '../release-products.command.js';

@CommandHandler(ReleaseProductsCommand)
export class ReleaseProductsCommandHandler implements ICommandHandler<ReleaseProductsCommand> {
  constructor(
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private publisher: EventPublisher,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ReleaseProductsCommand): Promise<void> {
    const releasedItems: ProductItem[] = [];
    for (const item of command.items) {
      const product = await this.productRepository.loadById(item.getId());
      if (product) {
        const trackedProduct = this.publisher.mergeObjectContext(product);
        trackedProduct.release(command.orderId,item.getQty());
        await this.productRepository.save(trackedProduct);
        trackedProduct.commit();
        releasedItems.push(item);
      }
    }
    this.eventBus.publish(new ProductsReleasedEvent(command.orderId, releasedItems));
  }
}