import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { ProductRepository } from '../../../ports/product.repository.interface.js';
import { UpdateProductCommand } from '../update-product.command.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../../../../shared/domain/value-objects/money.vo.js';
import { UpdateProductCommandHandler } from './update-product.handler.js';

describe('UpdateProductCommandHandler', () => {
  let commandHandler: UpdateProductCommandHandler;
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

    commandHandler = new UpdateProductCommandHandler(productRepository, eventPublisher);
  });

  it('should update an existing product and commit the event', async () => {
    const command = new UpdateProductCommand(
      'product-1',
      'Updated Product',
      150,
      15,
      10,
      30,
    );

    const existingProduct = {
      id: new ProductId(command.id),
      name: 'Old Product',
      unitPrice: new Money(100),
      availableQty: new Quantity(100),
      minThres: new Quantity(5),
      maxThres: new Quantity(20),
      updateName: jest.fn(),
      updateUnitPrice: jest.fn(),
      updateAvailableQty: jest.fn(),
      updateMinThres: jest.fn(),
      updateMaxThres: jest.fn(),
      commit: jest.fn(),
    };

    (productRepository.loadById as jest.Mock).mockResolvedValue(existingProduct);

    await commandHandler.execute(command);

    expect(productRepository.loadById).toHaveBeenCalledWith(new ProductId(command.id));
    expect(existingProduct.updateName).toHaveBeenCalledWith(command.name);
    expect(existingProduct.updateUnitPrice).toHaveBeenCalledWith(new Money(command.price!));
    expect(existingProduct.updateAvailableQty).toHaveBeenCalledWith(new Quantity(command.quantity!));
    expect(existingProduct.updateMinThres).toHaveBeenCalledWith(new Quantity(command.minThres!));
    expect(existingProduct.updateMaxThres).toHaveBeenCalledWith(new Quantity(command.maxThres!));
    expect(productRepository.save).toHaveBeenCalledWith(existingProduct);
    expect(existingProduct.commit).toHaveBeenCalled();
    expect(eventPublisher.mergeObjectContext).toHaveBeenCalledWith(existingProduct);
  });

  it('should throw an error if the product does not exist', async () => {
    const command = new UpdateProductCommand(
      'product-1',
      'Updated Product',
      150,
      15,
      10,
      30,
    );

    (productRepository.loadById as jest.Mock).mockResolvedValue(null);

    await expect(commandHandler.execute(command)).rejects.toThrow(`Product with ID ${command.id} not found.`);
    expect(productRepository.save).not.toHaveBeenCalled();
    expect(eventPublisher.mergeObjectContext).not.toHaveBeenCalled();
  });
});