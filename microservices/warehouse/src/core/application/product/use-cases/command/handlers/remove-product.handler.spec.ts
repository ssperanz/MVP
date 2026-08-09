import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RemoveProductCommand } from '../remove-product.command.js';
import type { ProductRepository } from '../../../ports/product.repository.interface.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { RemoveProductCommandHandler } from './remove-product.handler.js';

describe('RemoveProductCommandHandler', () => {
  let commandHandler: RemoveProductCommandHandler;
  let productRepository: ProductRepository;
  let eventPublisher: EventPublisher;

  beforeEach(() => {
    productRepository = {
      loadById: jest.fn(),
      delete: jest.fn(),
    } as unknown as ProductRepository;

    eventPublisher = {
      mergeObjectContext: jest.fn().mockImplementation((product) => product),
    } as unknown as EventPublisher;

    commandHandler = new RemoveProductCommandHandler(productRepository, eventPublisher);
  });

  it('should remove an existing product and commit the event', async () => {
    const command = new RemoveProductCommand('product-1');

    const existingProduct = {
      id: new ProductId(command.id),
      delete: jest.fn(),
      commit: jest.fn(),
    };

    (productRepository.loadById as jest.Mock).mockResolvedValue(existingProduct);

    await commandHandler.execute(command);

    expect(productRepository.loadById).toHaveBeenCalledWith(new ProductId(command.id));
    expect(existingProduct.delete).toHaveBeenCalled();
    expect(productRepository.delete).toHaveBeenCalledWith(new ProductId(command.id));
    expect(existingProduct.commit).toHaveBeenCalled();
  });

  it('should not attempt to remove a product if it does not exist', async () => {
    const command = new RemoveProductCommand('product-1');

    (productRepository.loadById as jest.Mock).mockResolvedValue(null);

    await commandHandler.execute(command);

    expect(productRepository.loadById).toHaveBeenCalledWith(new ProductId(command.id));
    expect(productRepository.delete).not.toHaveBeenCalled();
  });
});