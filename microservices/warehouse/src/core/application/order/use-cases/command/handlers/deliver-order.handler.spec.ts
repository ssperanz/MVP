import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import { DeliverOrderCommand } from '../deliver-order.command.js';
import { OrderDeliveredEvent } from '../../../events/order-delivered.event.js';
import { ReplenishmentOrder } from 'src/core/domain/order/entities/replenishment-order.entity.js';
import { ReplenishmentDeliveredEvent } from '../../../events/replenishment-delivered.event.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { DeliverOrderCommandHandler } from './deliver-order.handler.js';

describe('DeliverOrderCommandHandler', () => {
  let commandHandler: DeliverOrderCommandHandler;
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

    commandHandler = new DeliverOrderCommandHandler(orderRepositoryMock, productRepositoryMock, eventBusMock);
  });

  it('should deliver an order and publish the appropriate event', async () => {
    const command = new DeliverOrderCommand('order-1');

    const orderMock = {
      getOrderId: jest.fn().mockReturnValue(new OrderId('order-1')),
      getOrderItems: jest.fn().mockReturnValue([]),
    } as unknown as jest.Mocked<ReplenishmentOrder>;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    await commandHandler.execute(command);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(new OrderId('order-1'));
    expect(eventBusMock.publish).toHaveBeenCalled();
  });

  it('should throw an error if the order is not found', async () => {
    const command = new DeliverOrderCommand('order-1');
    orderRepositoryMock.load.mockResolvedValue(null);

    await expect(commandHandler.execute(command)).rejects.toThrow('Order order-1 not found');
  });

  it('should throw an error if a product is not found', async () => {
    const command = new DeliverOrderCommand('order-1');

    const orderMock = {
      getOrderId: jest.fn().mockReturnValue(new OrderId('order-1')),
      getOrderItems: jest.fn().mockReturnValue([{ getId: jest.fn().mockReturnValue({ id: 'product-1' }), getQty: jest.fn() }]),
    } as unknown as jest.Mocked<ReplenishmentOrder>;

    orderRepositoryMock.load.mockResolvedValue(orderMock);
    productRepositoryMock.loadById.mockResolvedValue(null);

    await expect(commandHandler.execute(command)).rejects.toThrow('Product product-1 not found');
  });



});