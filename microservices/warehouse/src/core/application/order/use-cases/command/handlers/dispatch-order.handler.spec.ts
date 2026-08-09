import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DispatchOrderCommand } from '../dispatch-order.command.js';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { OrderDispatchedEvent } from '../../../events/order-dispatched.event.js';
import { OrderDispatchFailedEvent } from '../../../events/order-dispatch-failed.event.js';
import { TransferOrder } from 'src/core/domain/order/entities/transfer-order.entity.js';
import { DispatchOrderCommandHandler } from './dispatch-order.handler.js';
import { OrderItem } from 'src/shared/domain/value-objects/order-item.vo.js';
import { Order } from 'src/core/domain/order/entities/order.entity.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { OrderType } from 'src/shared/domain/enums/order-type.enum.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo.js';
import { Product } from 'src/core/domain/product/entities/product.entity.js';

describe('DispatchOrderCommandHandler', () => {
  let commandHandler: DispatchOrderCommandHandler;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let productRepositoryMock: jest.Mocked<ProductRepository>;
  let eventBusMock: jest.Mocked<EventBus>;

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

    commandHandler = new DispatchOrderCommandHandler(orderRepositoryMock, productRepositoryMock, eventBusMock);
  });

  it('should dispatch an order and publish the appropriate event', async () => {
    const command = new DispatchOrderCommand('order-1');

    const productMock = {
      dispatch: jest.fn(),

    } as unknown as Product;

    const orderMock = new TransferOrder(
      new OrderId('order-1'),
      [new OrderItem(new ProductId('product-1'), new Quantity(5), new Money(100))],
      OrderType.TRANSFER,
      new WarehouseId(1),
      new WarehouseId(2),
      OrderState.VALIDATING,
      new Date(),
    );

    orderRepositoryMock.load.mockResolvedValue(orderMock);


    productRepositoryMock.loadById.mockResolvedValue(productMock);

    await commandHandler.execute(command);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(new OrderId('order-1'));
    expect(productRepositoryMock.loadById).toHaveBeenCalledWith(new ProductId('product-1'));
    expect(productMock.dispatch).toHaveBeenCalledWith(new OrderId('order-1'), new Quantity(5));
    expect(productRepositoryMock.save).toHaveBeenCalledWith(productMock);
    expect(eventBusMock.publish).toHaveBeenCalledWith(expect.any(OrderDispatchedEvent));
  });

  it('should publish an OrderDispatchFailedEvent if dispatching fails', async () => {
    const command = new DispatchOrderCommand('order-1');

    const orderMock = new TransferOrder(
      new OrderId('order-1'),
      [new OrderItem(new ProductId('product-1'), new Quantity(5), new Money(100))],
      OrderType.TRANSFER,
      new WarehouseId(1),
      new WarehouseId(2),
      OrderState.VALIDATING,
      new Date(),
    );

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    const productMock = {
      dispatch: jest.fn().mockImplementation(() => {
        throw new Error('Dispatch failed');
      }),
    } as unknown as Product;

    productRepositoryMock.loadById.mockResolvedValue(productMock);

    await commandHandler.execute(command);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(new OrderId('order-1'));
    expect(productRepositoryMock.loadById).toHaveBeenCalledWith(new ProductId('product-1'));
    expect(productMock.dispatch).toHaveBeenCalledWith(new OrderId('order-1'), new Quantity(5));
    expect(eventBusMock.publish).toHaveBeenCalledWith(expect.any(OrderDispatchFailedEvent));
  });

  it('should throw an error if the order is not found', async () => {
    const command = new DispatchOrderCommand('order-1');

    orderRepositoryMock.load.mockResolvedValue(null);

    await expect(commandHandler.execute(command)).rejects.toThrow(`Order ${command.orderId} not found`);
  });

  it('should throw an error if the order is not a transfer order', async () => {
    const command = new DispatchOrderCommand('order-1');

    const nonTransferOrderMock = {
      getOrderId: jest.fn().mockReturnValue(new OrderId('order-1')),
      getOrderItems: jest.fn().mockReturnValue([]),
    } as unknown as TransferOrder;

    orderRepositoryMock.load.mockResolvedValue(nonTransferOrderMock);

    await expect(commandHandler.execute(command)).rejects.toThrow(`Order ${command.orderId} is not a transfer order`);
  });
});