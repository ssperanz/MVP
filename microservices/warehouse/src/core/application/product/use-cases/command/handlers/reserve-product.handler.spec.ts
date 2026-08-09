import { CommandHandler, ICommandHandler, EventPublisher, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ReserveProductsCommand } from '../reserve-products.command.js';
import type { ProductRepository } from '../../../ports/product.repository.interface.js';
import { ProductsReservedEvent } from '../../../events/products-reserved.event.js';
import { ReserveProductsCommandHandler } from './reserve-product.handler.js';
import { ProductItem } from '../../../../../../shared/domain/value-objects/product-item.vo.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';

describe('ReserveProductsCommandHandler', () => {
  let commandHandler: ReserveProductsCommandHandler;
  let productRepository: ProductRepository;
  let eventPublisher: EventPublisher;
  let eventBus: EventBus;

  beforeEach(() => {
    productRepository = {
      loadById: jest.fn(),
      save: jest.fn(),
    } as unknown as ProductRepository;

    eventPublisher = {
      mergeObjectContext: jest.fn().mockImplementation((product) => product),
    } as unknown as EventPublisher;

    eventBus = {
      publish: jest.fn(),
    } as unknown as EventBus;

    commandHandler = new ReserveProductsCommandHandler(productRepository, eventPublisher, eventBus);
  });

  it('should reserve products and commit the event', async () => {
    const command = new ReserveProductsCommand(new OrderId('order-1'), [
      new ProductItem(new ProductId('product-1'), new Quantity(5)),
      new ProductItem(new ProductId('product-2'), new Quantity(3)),
    ]);

    const existingProduct1 = {
      id: { productId: 'product-1' },
      reserve: jest.fn(),
      commit: jest.fn(),
    };

    const existingProduct2 = {
      id: { productId: 'product-2' },
      reserve: jest.fn(),
      commit: jest.fn(),
    };

    (productRepository.loadById as jest.Mock).mockImplementation((id) => {
      if (id.productId === 'product-1') return Promise.resolve(existingProduct1);
      if (id.productId === 'product-2') return Promise.resolve(existingProduct2);
      return Promise.resolve(null);
    });

    await commandHandler.execute(command);

    expect(productRepository.loadById).toHaveBeenCalledWith({ productId: 'product-1' });
    expect(productRepository.loadById).toHaveBeenCalledWith({ productId: 'product-2' });
    expect(existingProduct1.reserve).toHaveBeenCalledWith(new OrderId('order-1'), new Quantity(5));
    expect(existingProduct2.reserve).toHaveBeenCalledWith(new OrderId('order-1'), new Quantity(3));
    expect(productRepository.save).toHaveBeenCalledWith(existingProduct1);
    expect(productRepository.save).toHaveBeenCalledWith(existingProduct2);
    expect(existingProduct1.commit).toHaveBeenCalled();
    expect(existingProduct2.commit).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: expect.objectContaining({
          id: 'order-1',
        }),
        itemsReserved: command.items,
      }),
    );
  });
});