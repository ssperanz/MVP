import { CommandHandler, ICommandHandler, EventBus, EventPublisher, IEvent } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import { DeliverOrderCommand } from '../deliver-order.command.js';
import { OrderDeliveredEvent } from '../../../events/order-delivered.event.js';
import { ReplenishmentOrder } from 'src/core/domain/order/entities/replenishment-order.entity.js';
import { ReplenishmentDeliveredEvent } from '../../../events/replenishment-delivered.event.js';
import { UpdateOrderStateCommand } from '../update-order-state.command.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { Order } from 'src/core/domain/order/entities/order.entity.js';
import { OrderState } from 'src/shared/domain/enums/order-state.enum.js';
import { UpdateOrderStateCommandHandler } from './update-order-state.handler.js';

describe('UpdateOrderStateCommandHandler', () => {
  let commandHandler: UpdateOrderStateCommandHandler;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepositoryMock = {
      load: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    const publisherMock = {
      mergeObjectContext: jest.fn((order) => order),
    } as unknown as EventPublisher<IEvent>;

    commandHandler = new UpdateOrderStateCommandHandler(orderRepositoryMock, publisherMock);
  });

  it('should update the order state and save the order', async () => {
    const command = new UpdateOrderStateCommand('order-1', OrderState.DISPATCHED);

    const orderMock = {
      setState: jest.fn(),
      getOrderId: jest.fn().mockReturnValue(new OrderId('order-1')),
      commit: jest.fn(),
    } as unknown as jest.Mocked<Order>;

    orderRepositoryMock.load.mockResolvedValue(orderMock);

    await commandHandler.execute(command);

    expect(orderRepositoryMock.load).toHaveBeenCalledWith(new OrderId('order-1'));
    expect(orderMock.setState).toHaveBeenCalledWith(OrderState.DISPATCHED);
    expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderMock);
  });

  it('should throw an error if the order is not found', async () => {
    const command = new UpdateOrderStateCommand('non-existent-order-id', OrderState.DISPATCHED);

    orderRepositoryMock.load.mockResolvedValue(null);

    await expect(commandHandler.execute(command)).rejects.toThrow(
      `Order ${command.orderId} not found`,
    );
  });
});