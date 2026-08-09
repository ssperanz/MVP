import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { GetAllOrdersQuery } from '../get-all-orders.query';
import type { OrderReadModel, OrderReadModelRepository } from '../../../ports/order-read-model.repository.interface';
import { OrderDto } from '../../../dto/order.dto';
import { GetAllOrdersQueryHandler } from './get-all-orders.handler';
  
describe('GetAllOrdersQueryHandler', () => {
  let queryHandler: GetAllOrdersQueryHandler;
  let orderReadModelMock: jest.Mocked<OrderReadModelRepository>;

  beforeEach(() => {
    orderReadModelMock = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<OrderReadModelRepository>;

    queryHandler = new GetAllOrdersQueryHandler(orderReadModelMock);
  });

  it('should return an array of OrderDto', async () => {
    const mockOrdersData = [
      { orderId: 'order-1', orderState: 'pending' },
      { orderId: 'order-2', orderState: 'validated' },
    ] as unknown as OrderReadModel[];
    orderReadModelMock.findAll.mockResolvedValue(mockOrdersData);

    const query = new GetAllOrdersQuery();
    const result = await queryHandler.execute(query);

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(OrderDto);
    expect(result[0].orderId).toBe('order-1');
    expect(result[0].orderState).toBe('pending');
    expect(result[1]).toBeInstanceOf(OrderDto);
    expect(result[1].orderId).toBe('order-2');
    expect(result[1].orderState).toBe('validated');
  });
});