import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { OrderReadModelRepository } from '../../../ports/order-read-model.repository.interface';
import { GetOrderByIdQuery } from '../get-order-by-id.query';
import { OrderDto } from '../../../dto/order.dto';
import { GetOrdersByWhIdQuery } from '../get-orders-by-wh-id.query';
import { GetOrdersByWhIdQueryHandler } from './get-orders-by-wh-id.handler';

describe('GetOrdersByWhIdQueryHandler', () => {
  let queryHandler: GetOrdersByWhIdQueryHandler;
  let orderReadModelMock: OrderReadModelRepository;

  beforeEach(() => {
    orderReadModelMock = {
      findByWhId: jest.fn(),
    } as unknown as OrderReadModelRepository;

    queryHandler = new GetOrdersByWhIdQueryHandler(orderReadModelMock);
  });

  it('should return null if no orders are found', async () => {
    (orderReadModelMock.findByWhId as jest.Mock).mockResolvedValue(null);

    const result = await queryHandler.execute(new GetOrdersByWhIdQuery(-1));

    expect(result).toBeNull();
  });

  it('should return an array of OrderDto if orders are found', async () => {
    const mockOrders = [
      { id: '1', items: [], total: 100 },
      { id: '2', items: [], total: 200 },
    ];
    (orderReadModelMock.findByWhId as jest.Mock).mockResolvedValue(mockOrders);

    const result = await queryHandler.execute(new GetOrdersByWhIdQuery(1));

    expect(result).toEqual([
      expect.objectContaining({ id: '1', items: [], total: 100 }),
      expect.objectContaining({ id: '2', items: [], total: 200 }),
    ]);
  });
});