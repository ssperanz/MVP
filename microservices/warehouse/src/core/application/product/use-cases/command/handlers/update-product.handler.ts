import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { ProductRepository } from '../../../ports/product.repository.interface.js';
import { UpdateProductCommand } from '../update-product.command.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../../../../shared/domain/value-objects/money.vo.js';

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const product = await this.productRepository.loadById(new ProductId(command.id));
    if (!product) {
      throw new Error(`Product with ID ${command.id} not found.`);
    }

    const tracked = this.publisher.mergeObjectContext(product);

    if (command.name !== undefined) tracked.updateName(command.name);
    if (command.price !== undefined) tracked.updateUnitPrice(new Money(command.price));
    if (command.quantity !== undefined) tracked.updateAvailableQty(new Quantity(command.quantity));
    if (command.minThres !== undefined) tracked.updateMinThres(new Quantity(command.minThres));
    if (command.maxThres !== undefined) tracked.updateMaxThres(new Quantity(command.maxThres));

    await this.productRepository.save(tracked);
    tracked.commit();
  }
}