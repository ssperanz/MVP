import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProductCommand } from '../create-product.command.js';
import type { ProductRepository } from '../../../ports/product.repository.interface.js';
import { Product } from '../../../../../domain/product/entities/product.entity.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../../../../shared/domain/value-objects/money.vo.js';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const existingProduct = await this.productRepository.loadById(new ProductId(command.id));
    if (existingProduct) {
      throw new Error(`Product with ID ${command.id} already exists.`);
    }
    const product = this.publisher.mergeObjectContext(
      Product.create(
        new ProductId(command.id),
        command.name,
        new Money(command.price),
        new Quantity(command.quantity),
        new Quantity(command.minThres),
        new Quantity(command.maxThres),
      ),
    );
    await this.productRepository.save(product);
    product.commit();
  }
}