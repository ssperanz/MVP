import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RemoveProductCommand } from '../remove-product.command.js';
import type { ProductRepository } from '../../../ports/product.repository.interface.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';

@CommandHandler(RemoveProductCommand)
export class RemoveProductCommandHandler implements ICommandHandler<RemoveProductCommand> {
  constructor(
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: RemoveProductCommand): Promise<void> {
    const id = new ProductId(command.id);
    const product = await this.productRepository.loadById(id);
    if (product) {
      const tracked = this.publisher.mergeObjectContext(product);
      tracked.delete();
      await this.productRepository.delete(id);
      tracked.commit();
    }
  }
}