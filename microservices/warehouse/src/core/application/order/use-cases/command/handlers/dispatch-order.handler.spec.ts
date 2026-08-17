import { EventBus, EventPublisher } from '@nestjs/cqrs';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';

import { DispatchOrderCommand } from '../dispatch-order.command.js';
import { DispatchOrderCommandHandler } from './dispatch-order.handler.js';

import { OrderDispatchedEvent } from '../../../events/order-dispatched.event.js';
import { OrderDispatchFailedEvent } from '../../../events/order-dispatch-failed.event.js';

import { TransferOrder } from '../../../../../../core/domain/order/entities/transfer-order.entity.js';
import { SellOrder } from '../../../../../../core/domain/order/entities/sell-order.entity.js';

import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { OrderItem } from '../../../../../../shared/domain/value-objects/order-item.vo.js';
import { Money } from '../../../../../../shared/domain/value-objects/money.vo.js';
import { OrderType } from '../../../../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../../../../shared/domain/enums/order-state.enum.js';
import { WarehouseId } from '../../../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { Product } from '../../../../../../core/domain/product/entities/product.entity.js';

describe('DispatchOrderCommandHandler', () => {
  let commandHandler: DispatchOrderCommandHandler;

  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let productRepositoryMock: jest.Mocked<ProductRepository>;
  let eventBusMock: jest.Mocked<EventBus>;

  let publisherMock: jest.Mocked<EventPublisher>;
  let trackedProductMock: jest.Mocked<Product>;

  beforeEach(() => {
    orderRepositoryMock = {
      load: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    productRepositoryMock = {
      loadById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    eventBusMock = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    trackedProductMock = {
      dispatch: jest.fn(),
      commit: jest.fn(),
    } as unknown as jest.Mocked<Product>;

    publisherMock = {
      mergeObjectContext: jest.fn().mockReturnValue(trackedProductMock),
    } as unknown as jest.Mocked<EventPublisher>;

    commandHandler = new DispatchOrderCommandHandler(
      orderRepositoryMock,
      productRepositoryMock,
      eventBusMock,
      publisherMock,
    );
  });

  it('should dispatch a transfer order and publish OrderDispatchedEvent', async () => {
    const orderId = new OrderId('order-1');

    const order = new TransferOrder(
      orderId,
      [
        new OrderItem(
          new ProductId('product-1'),
          new Quantity(5),
          new Money(100),
        ),
      ],
      OrderType.TRANSFER,
      new WarehouseId(1),
      new WarehouseId(2),
      OrderState.VALIDATING,
      new Date(),
    );

    const product = {} as Product;

    orderRepositoryMock.load.mockResolvedValue(order);
    productRepositoryMock.loadById.mockResolvedValue(product);

    await commandHandler.execute(
      new DispatchOrderCommand('order-1'),
    );

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(orderId);

    expect(productRepositoryMock.loadById).toHaveBeenCalledWith(
      new ProductId('product-1'),
    );

    expect(publisherMock.mergeObjectContext).toHaveBeenCalledWith(product);

    expect(trackedProductMock.dispatch).toHaveBeenCalledWith(
      orderId,
      new Quantity(5),
    );

    expect(productRepositoryMock.save).toHaveBeenCalledWith(
      trackedProductMock,
    );

    expect(trackedProductMock.commit).toHaveBeenCalled();

    expect(eventBusMock.publish).toHaveBeenCalledWith(
      expect.any(OrderDispatchedEvent),
    );
  });

  it('should publish OrderDispatchFailedEvent when dispatching fails', async () => {
    const orderId = new OrderId('order-1');

    const order = new TransferOrder(
      orderId,
      [
        new OrderItem(
          new ProductId('product-1'),
          new Quantity(5),
          new Money(100),
        ),
      ],
      OrderType.TRANSFER,
      new WarehouseId(1),
      new WarehouseId(2),
      OrderState.VALIDATING,
      new Date(),
    );

    orderRepositoryMock.load.mockResolvedValue(order);
    productRepositoryMock.loadById.mockResolvedValue({} as Product);

    trackedProductMock.dispatch.mockImplementation(() => {
      throw new Error('Dispatch failed');
    });

    await commandHandler.execute(
      new DispatchOrderCommand('order-1'),
    );

    expect(eventBusMock.publish).toHaveBeenCalledWith(
      expect.any(OrderDispatchFailedEvent),
    );
  });

  it('should throw an error if the order is not found', async () => {
    orderRepositoryMock.load.mockResolvedValue(null);

    await expect(
      commandHandler.execute(
        new DispatchOrderCommand('order-1'),
      ),
    ).rejects.toThrow('Order order-1 not found');
  });

  it('should throw an error if the order is not a transfer order', async () => {
    const orderId = new OrderId('order-1');

    const nonTransferOrder = {
      getOrderId: jest.fn().mockReturnValue(orderId),
      getOrderItems: jest.fn().mockReturnValue([]),
    } as any;

    orderRepositoryMock.load.mockResolvedValue(nonTransferOrder);

    await expect(
      commandHandler.execute(
        new DispatchOrderCommand('order-1'),
      ),
    ).rejects.toThrow(
      'Order order-1 is not a transfer order',
    );
  });

  it('should dispatch a sell order and publish OrderDispatchedEvent', async () => {
    const orderId = new OrderId('order-1');

    const order = new SellOrder(
      orderId,
      [
        new OrderItem(
          new ProductId('product-1'),
          new Quantity(2),
          new Money(100),
        ),
      ],
      OrderType.SELL,
      new WarehouseId(1),
      {} as any,
      OrderState.VALIDATING,
      new Date(),
    );

    orderRepositoryMock.load.mockResolvedValue(order);
    productRepositoryMock.loadById.mockResolvedValue({} as Product);

    await commandHandler.execute(
      new DispatchOrderCommand('order-1'),
    );

    expect(trackedProductMock.dispatch).toHaveBeenCalledWith(
      orderId,
      new Quantity(2),
    );

    expect(trackedProductMock.commit).toHaveBeenCalled();

    expect(eventBusMock.publish).toHaveBeenCalledWith(
      expect.any(OrderDispatchedEvent),
    );
  });

  it('should publish OrderDispatchFailedEvent when a product does not exist', async () => {
    const orderId = new OrderId('order-1');

    const order = new TransferOrder(
      orderId,
      [
        new OrderItem(
          new ProductId('product-1'),
          new Quantity(5),
          new Money(100),
        ),
      ],
      OrderType.TRANSFER,
      new WarehouseId(1),
      new WarehouseId(2),
      OrderState.VALIDATING,
      new Date(),
    );

    orderRepositoryMock.load.mockResolvedValue(order);
    productRepositoryMock.loadById.mockResolvedValue(null);

    await commandHandler.execute(
      new DispatchOrderCommand('order-1'),
    );

    expect(productRepositoryMock.loadById).toHaveBeenCalledWith(
      new ProductId('product-1'),
    );

    expect(eventBusMock.publish).toHaveBeenCalledWith(
      expect.any(OrderDispatchFailedEvent),
    );
  });
});