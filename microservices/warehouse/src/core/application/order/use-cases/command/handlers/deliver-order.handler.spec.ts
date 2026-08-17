import {
  EventBus,
  EventPublisher,
  IEvent,
} from '@nestjs/cqrs';

import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';

import { DeliverOrderCommand } from '../deliver-order.command.js';
import { DeliverOrderCommandHandler } from './deliver-order.handler.js';

import { OrderDeliveredEvent } from '../../../events/order-delivered.event.js';
import { OrderReceivedEvent } from '../../../events/order-received.event.js';
import { ReplenishmentDeliveredEvent } from '../../../events/replenishment-delivered.event.js';

import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderType } from '../../../../../../shared/domain/enums/order-type.enum.js';

describe('DeliverOrderCommandHandler', () => {
  let commandHandler: DeliverOrderCommandHandler;

  let productRepositoryMock: jest.Mocked<ProductRepository>;
  let eventBusMock: jest.Mocked<EventBus>;

  beforeEach(() => {
    productRepositoryMock = {
      loadById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    eventBusMock = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    const publisherMock = {
      mergeObjectContext: jest.fn((product) => ({
        ...product,
        receive: jest.fn(),
        commit: jest.fn(),
      })),
    } as unknown as EventPublisher<IEvent>;

    commandHandler = new DeliverOrderCommandHandler(
      productRepositoryMock,
      eventBusMock,
      publisherMock,
    );
  });

  it('should publish OrderDeliveredEvent for a SELL order', async () => {
    const command = new DeliverOrderCommand(
      'order-1',
      OrderType.SELL,
      [],
      1,
      2,
    );

    await commandHandler.execute(command);

    expect(eventBusMock.publish).toHaveBeenCalledWith(
      expect.any(OrderDeliveredEvent),
    );

    expect(productRepositoryMock.loadById).not.toHaveBeenCalled();
    expect(productRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should receive all products and publish OrderReceivedEvent for a TRANSFER order', async () => {
    const product = {
      id: new ProductId('product-1'),
    };

    const trackedProduct = {
      receive: jest.fn(),
      commit: jest.fn(),
    };

    const publisherMock = {
      mergeObjectContext: jest.fn().mockReturnValue(trackedProduct),
    } as unknown as EventPublisher<IEvent>;

    commandHandler = new DeliverOrderCommandHandler(
      productRepositoryMock,
      eventBusMock,
      publisherMock,
    );

    productRepositoryMock.loadById.mockResolvedValue(product as any);

    const command = new DeliverOrderCommand(
      'order-1',
      OrderType.TRANSFER,
      [
        {
          productId: 'product-1',
          qty: 5,
        },
      ],
      1,
      2,
    );

    await commandHandler.execute(command);

    expect(productRepositoryMock.loadById).toHaveBeenCalledWith(
      new ProductId('product-1'),
    );

    expect(trackedProduct.receive).toHaveBeenCalledWith(
      new OrderId('order-1'),
      expect.anything(),
    );

    expect(productRepositoryMock.save).toHaveBeenCalledWith(
      trackedProduct,
    );

    expect(trackedProduct.commit).toHaveBeenCalled();

    expect(eventBusMock.publish).toHaveBeenCalledWith(
      expect.any(OrderReceivedEvent),
    );

    expect(eventBusMock.publish).not.toHaveBeenCalledWith(
      expect.any(ReplenishmentDeliveredEvent),
    );
  });

  it('should throw an error if a product is not found', async () => {
    productRepositoryMock.loadById.mockResolvedValue(null);

    const command = new DeliverOrderCommand(
      'order-1',
      OrderType.TRANSFER,
      [
        {
          productId: 'product-1',
          qty: 5,
        },
      ],
      1,
      2,
    );

    await expect(
      commandHandler.execute(command),
    ).rejects.toThrow(
      'Error occurred while delivering order order-1: Product product-1 not found',
    );

    expect(productRepositoryMock.loadById).toHaveBeenCalledWith(
      new ProductId('product-1'),
    );

    expect(productRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should publish ReplenishmentDeliveredEvent for a REPLENISHMENT order', async () => {
    const product = {
      id: new ProductId('product-1'),
    };

    const trackedProduct = {
      receive: jest.fn(),
      commit: jest.fn(),
    };

    const publisherMock = {
      mergeObjectContext: jest.fn().mockReturnValue(trackedProduct),
    } as unknown as EventPublisher<IEvent>;

    commandHandler = new DeliverOrderCommandHandler(
      productRepositoryMock,
      eventBusMock,
      publisherMock,
    );

    productRepositoryMock.loadById.mockResolvedValue(product as any);

    const command = new DeliverOrderCommand(
      'order-1',
      OrderType.REPLENISHMENT,
      [
        {
          productId: 'product-1',
          qty: 5,
        },
      ],
      1,
      2,
      'order-reference-1',
    );

    await commandHandler.execute(command);

    expect(eventBusMock.publish).toHaveBeenCalledWith(
      expect.any(OrderReceivedEvent),
    );

    expect(eventBusMock.publish).toHaveBeenCalledWith(
      expect.any(ReplenishmentDeliveredEvent),
    );
  });
});