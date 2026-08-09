import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProductCommand } from '../create-product.command.js';
import type { ProductRepository } from '../../../ports/product.repository.interface.js';
import { Product } from '../../../../../domain/product/entities/product.entity.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../../../../shared/domain/value-objects/money.vo.js';
import { CreateProductCommandHandler } from './create-product.handler.js';

describe('CreateProductCommandHandler', () => {
  let commandHandler: CreateProductCommandHandler;
  let productRepository: ProductRepository;
  let eventPublisher: EventPublisher;

  beforeEach(() => {
    productRepository = {
      loadById: jest.fn(),
      save: jest.fn(),
    } as unknown as ProductRepository;

    eventPublisher = {
      mergeObjectContext: jest.fn().mockImplementation((product) => product),
    } as unknown as EventPublisher;

    commandHandler = new CreateProductCommandHandler(productRepository, eventPublisher);
  });

  it('should create a new product and commit the event', async () => {
    const command = new CreateProductCommand(
      'product-1',
      'Test Product',
      100,
      10,
      5,
      20,
    );

    (productRepository.loadById as jest.Mock).mockResolvedValue(null);

    await commandHandler.execute(command);

    expect(productRepository.loadById).toHaveBeenCalledWith(new ProductId(command.id));
    expect(productRepository.save).toHaveBeenCalled();
    expect(eventPublisher.mergeObjectContext).toHaveBeenCalled();
  });

  it('should throw an error if the product already exists', async () => {
    const command = new CreateProductCommand(
      'product-1',
      'Test Product',
      100,
      10,
      5,
      20,
    );

    (productRepository.loadById as jest.Mock).mockResolvedValue(new Product(
      new ProductId(command.id),
      command.name,
      new Money(command.price),
      new Quantity(command.quantity),
      new Quantity(0),
      new Quantity(command.minThres),
      new Quantity(command.maxThres),
    ));

    await expect(commandHandler.execute(command)).rejects.toThrow(`Product with ID ${command.id} already exists.`);
  });
});