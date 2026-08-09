import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { OrderReadModel, OrderReadModelRepository } from '../../../ports/order-read-model.repository.interface';
import { GetOrderQuery } from '../get-order.query';
import { OrderDto } from '../../../dto/order.dto';
import { GetOrderQueryHandler } from './get-order.handler';

describe('GetOrderQueryHandler', () => {
  let queryHandler: GetOrderQueryHandler;
  let orderReadModelMock: jest.Mocked<OrderReadModelRepository>;

  beforeEach(() => {
    orderReadModelMock = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<OrderReadModelRepository>;

    queryHandler = new GetOrderQueryHandler(orderReadModelMock);
  });

  it('should return an OrderDto when the order exists', async () => {
    const orderId = 'order-1';
    const mockOrderData = { orderId: orderId, orderState: 'pending' } as unknown as OrderReadModel;
    orderReadModelMock.findById.mockResolvedValue(mockOrderData);

    const query = new GetOrderQuery(orderId);
    const result = await queryHandler.execute(query);

    expect(result).toBeInstanceOf(OrderDto);
    expect(result?.orderId).toBe(orderId);
    expect(result?.orderState).toBe('pending');
  });

  it('should return null when the order does not exist', async () => {
    const orderId = 'non-existent-order-id';
    orderReadModelMock.findById.mockResolvedValue(null);

    const query = new GetOrderQuery(orderId);
    const result = await queryHandler.execute(query);

    expect(result).toBeNull();
  });
});