import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateOrderCommand } from '../create-order.command.js';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import { SellOrder } from '../../../../../domain/order/entities/sell-order.entity.js';
import { TransferOrder } from '../../../../../domain/order/entities/transfer-order.entity.js';
import { ReplenishmentOrder } from '../../../../../domain/order/entities/replenishment-order.entity.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../../../shared/domain/value-objects/order-item.vo.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../../../../shared/domain/value-objects/money.vo.js';
import { WarehouseId } from '../../../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { Address } from '../../../../../../shared/domain/value-objects/address.vo.js';
import { OrderType } from '../../../../../../shared/domain/enums/order-type.enum.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import * as crypto from 'crypto';
import { CreateOrderCommandHandler } from './create-order.handler.js';

describe('CreateOrderCommandHandler', () => {
  let commandHandler: CreateOrderCommandHandler;
  let orderRepository: OrderRepository;
  let productRepository: ProductRepository;
  let eventPublisher: EventPublisher;

  beforeEach(() => {
    orderRepository = {
      save: jest.fn(),
    } as unknown as OrderRepository;

    productRepository = {
      loadById: jest.fn(),
    } as unknown as ProductRepository;

    eventPublisher = {
      mergeObjectContext: jest.fn().mockImplementation((order) => order),
    } as unknown as EventPublisher;

    commandHandler = new CreateOrderCommandHandler(orderRepository, productRepository, eventPublisher);
  });

  it('should create a sell order and commit the event', async () => {
    const command = new CreateOrderCommand(
      OrderType.SELL,
      [
        { productId: 'product-1', qty: 5 },
        { productId: 'product-2', qty: 3 },
      ],
      null,
      { streetName: 'Main St', civicNumber: 123, city: 'City', cap: '12345', country: 'Country' },
      null,
    );

    (productRepository.loadById as jest.Mock).mockResolvedValueOnce({
      getUnitPrice: jest.fn().mockReturnValue(new Money(10)),
    }).mockResolvedValueOnce({
      getUnitPrice: jest.fn().mockReturnValue(new Money(20)),
    });

    await commandHandler.execute(command);

    expect(productRepository.loadById).toHaveBeenCalledWith(new ProductId('product-1'));
    expect(productRepository.loadById).toHaveBeenCalledWith(new ProductId('product-2'));
    expect(orderRepository.save).toHaveBeenCalled();
    expect(eventPublisher.mergeObjectContext).toHaveBeenCalled();
  });

  it('should create a transfer order and commit the event', async () => {
    const command = new CreateOrderCommand(
      OrderType.TRANSFER,
      [
        { productId: 'product-1', qty: 5 },
      ],
      null,
      2,
      null,
    );

    (productRepository.loadById as jest.Mock).mockResolvedValueOnce({
      getUnitPrice: jest.fn().mockReturnValue(new Money(10)),
    });

    await commandHandler.execute(command);

    expect(productRepository.loadById).toHaveBeenCalledWith(new ProductId('product-1'));
    expect(orderRepository.save).toHaveBeenCalled();
    expect(eventPublisher.mergeObjectContext).toHaveBeenCalled();
  });

  it('should create a replenishment order and commit the event', async () => {
    const command = new CreateOrderCommand(
      OrderType.REPLENISHMENT,
      [
        { productId: 'product-1', qty: 5 },
      ],
      null,
      3,
      'order-ref-123',
    );

    (productRepository.loadById as jest.Mock).mockResolvedValueOnce({
      getUnitPrice: jest.fn().mockReturnValue(new Money(10)),
    });

    await commandHandler.execute(command);

    expect(productRepository.loadById).toHaveBeenCalledWith(new ProductId('product-1'));
    expect(orderRepository.save).toHaveBeenCalled();
    expect(eventPublisher.mergeObjectContext).toHaveBeenCalled();
  });

  it('should throw an error for unknown order type', async () => {
    const command = new CreateOrderCommand(
      'UNKNOWN' as OrderType,
      [
        { productId: 'product-1', qty: 5 },
      ],
      null,
      { streetName: 'Main St', civicNumber: 123, city: 'City', cap: '12345', country: 'Country' },
      null
    );

    await expect(commandHandler.execute(command)).rejects.toThrow('Unknown order type: UNKNOWN');
  });
});